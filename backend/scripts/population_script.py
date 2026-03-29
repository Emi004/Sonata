import json
import os
import re
import shutil
import subprocess
import sys
from getpass import getpass
from pathlib import Path
from urllib.parse import quote

import httpx
from dotenv import load_dotenv


SCRIPT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = SCRIPT_DIR.parent
ENV_PATH = BACKEND_DIR / "src" / ".env"

load_dotenv(ENV_PATH)

BACKEND_URL = os.getenv("SONATA_BACKEND_URL", "http://127.0.0.1:8080").rstrip("/")
SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
DOWNLOADS_DIR = SCRIPT_DIR / "downloads"
ALBUM_COVER_BUCKET = "album/cover"
TRACK_AUDIO_BUCKET = "tracks/audio"
SUPPORTED_AUDIO_EXTENSIONS = {".mp3", ".m4a", ".webm", ".opus", ".ogg", ".wav", ".aac"}
SUPPORTED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
DEFAULT_URLS = [
]


def sanitize_path_part(value: str) -> str:
	cleaned = re.sub(r'[<>:"/\\|?*\x00-\x1F]', "", value).strip()
	cleaned = re.sub(r"\s+", " ", cleaned)
	return cleaned or "unknown-album"


def normalize_album_title(title: str) -> str:
	normalized = title.strip()
	if normalized.lower().startswith("album - "):
		normalized = normalized[8:].strip()
	return normalized or "Unknown Album"


def read_env_or_prompt(name: str, prompt_text: str, secret: bool = False) -> str:
	value = os.getenv(name, "").strip()
	if value:
		return value
	if secret:
		return getpass(prompt_text)
	return input(prompt_text).strip()


def get_input_urls() -> list[str]:
	cli_urls = [arg.strip() for arg in sys.argv[1:] if arg.strip()]
	if cli_urls:
		return cli_urls

	env_urls = [url.strip() for url in os.getenv("SONATA_IMPORT_URLS", "").splitlines() if url.strip()]
	if env_urls:
		return env_urls

	return DEFAULT_URLS


def fetch_playlist_metadata(url: str) -> dict:
	command = ["yt-dlp", "--dump-single-json", url]
	result = subprocess.run(command, check=True, capture_output=True, text=True)
	return json.loads(result.stdout)


def has_ffmpeg_tools() -> bool:
	return shutil.which("ffmpeg") is not None and shutil.which("ffprobe") is not None


def get_downloaded_audio_files(album_dir: Path) -> list[Path]:
	return sorted(
		path
		for path in album_dir.iterdir()
		if path.is_file() and path.suffix.lower() in SUPPORTED_AUDIO_EXTENSIONS
	)


def download_playlist(url: str, album_dir: Path) -> list[Path]:
	album_dir.mkdir(parents=True, exist_ok=True)
	command = [
		"yt-dlp",
		"--extractor-args",
		"youtube:player-client=mweb,default",
		"-o",
		str(album_dir / "%(playlist_index)02d - %(title)s.%(ext)s"),
		url,
	]

	if has_ffmpeg_tools():
		command[1:1] = [
			"-x",
			"--audio-format",
			"mp3",
			"--audio-quality",
			"0",
			"--embed-thumbnail",
			"--add-metadata",
		]
	else:
		command[1:1] = ["-f", "bestaudio"]
		print("ffmpeg/ffprobe not found; downloading source audio without mp3 conversion.")

	subprocess.run(command, check=True)
	return get_downloaded_audio_files(album_dir)


def download_album_cover(image_url: str | None, album_dir: Path) -> Path | None:
	if not image_url:
		return None

	response = httpx.get(image_url, follow_redirects=True, timeout=60.0)
	response.raise_for_status()

	content_type = response.headers.get("content-type", "").lower()
	if "png" in content_type:
		suffix = ".png"
	elif "webp" in content_type:
		suffix = ".webp"
	elif "jpeg" in content_type or "jpg" in content_type:
		suffix = ".jpg"
	else:
		suffix = Path(image_url.split("?", 1)[0]).suffix or ".jpg"
	cover_path = album_dir / f"cover{suffix}"
	cover_path.write_bytes(response.content)
	return cover_path


def find_existing_cover_file(album_dir: Path) -> Path | None:
	image_files = sorted(
		path for path in album_dir.iterdir() if path.is_file() and path.suffix.lower() in SUPPORTED_IMAGE_EXTENSIONS
	)
	for path in image_files:
		if path.stem.lower().startswith("cover"):
			return path
	return image_files[0] if image_files else None


def resolve_cover_path(metadata: dict, album_dir: Path) -> Path | None:
	thumbnail_candidates: list[str] = []
	for key in ("thumbnail",):
		value = metadata.get(key)
		if isinstance(value, str) and value.strip():
			thumbnail_candidates.append(value.strip())

	thumbnails = metadata.get("thumbnails") or []
	if isinstance(thumbnails, list):
		for item in reversed(thumbnails):
			if isinstance(item, dict):
				url = (item.get("url") or "").strip()
				if url:
					thumbnail_candidates.append(url)

	entries = metadata.get("entries") or []
	for entry in entries:
		entry_thumbnail = entry.get("thumbnail")
		if isinstance(entry_thumbnail, str) and entry_thumbnail.strip():
			thumbnail_candidates.append(entry_thumbnail.strip())
		entry_thumbnails = entry.get("thumbnails") or []
		if isinstance(entry_thumbnails, list):
			for item in reversed(entry_thumbnails):
				if isinstance(item, dict):
					url = (item.get("url") or "").strip()
					if url:
						thumbnail_candidates.append(url)

	seen: set[str] = set()
	for image_url in thumbnail_candidates:
		if image_url in seen:
			continue
		seen.add(image_url)
		try:
			return download_album_cover(image_url, album_dir)
		except httpx.HTTPError:
			continue

	return find_existing_cover_file(album_dir)


def extract_artist_name(metadata: dict) -> str:
	for key in ("album_artist", "artist", "uploader"):
		value = metadata.get(key)
		if isinstance(value, str) and value.strip():
			return value.strip()

	entries = metadata.get("entries") or []
	for entry in entries:
		album_artists = entry.get("album_artists") or []
		if isinstance(album_artists, list):
			for artist in album_artists:
				if isinstance(artist, str) and artist.strip():
					return artist.strip()
				if isinstance(artist, dict):
					name = (artist.get("name") or "").strip()
					if name:
						return name

		for key in ("album_artist", "artist", "uploader"):
			value = entry.get(key)
			if isinstance(value, str) and value.strip():
				return value.strip()

	return "Unknown artist"


def login(client: httpx.Client, email: str, password: str) -> str:
	response = client.post(
		f"{BACKEND_URL}/auth/login",
		data={"username": email, "password": password},
		headers={"Content-Type": "application/x-www-form-urlencoded"},
	)
	response.raise_for_status()
	return response.json()["access_token"]


def get_current_user(client: httpx.Client, access_token: str) -> dict:
	response = client.get(
		f"{BACKEND_URL}/users/me",
		headers={"Authorization": f"Bearer {access_token}"},
	)
	response.raise_for_status()
	return response.json()


def upload_file_to_storage(
	client: httpx.Client,
	access_token: str,
	bucket: str,
	local_path: Path,
	remote_path: str,
) -> str:
	encoded_remote_path = quote(remote_path, safe="/")
	endpoint = f"{SUPABASE_URL}/storage/v1/object/{bucket}/{encoded_remote_path}"

	with local_path.open("rb") as file_handle:
		response = client.post(
			endpoint,
			content=file_handle.read(),
			headers={
				"Authorization": f"Bearer {access_token}",
				"apikey": SUPABASE_SERVICE_KEY,
				"x-upsert": "false",
				"cache-control": "3600",
				"Content-Type": "application/octet-stream",
			},
		)

	response.raise_for_status()
	return f"{SUPABASE_URL}/storage/v1/object/public/{bucket}/{encoded_remote_path}"


def create_album(
	client: httpx.Client,
	access_token: str,
	user: dict,
	title: str,
	image_url: str | None,
	artist_name: str,
	is_published: bool,
) -> dict:
	payload = {
		"title": title,
		"created_by": user["id"],
		"image_url": image_url,
		"is_published": is_published,
		"artist_name": artist_name,
	}
	response = client.post(
		f"{BACKEND_URL}/albums/create",
		json=payload,
		headers={"Authorization": f"Bearer {access_token}"},
	)
	response.raise_for_status()
	return response.json()


def create_track(
	client: httpx.Client,
	access_token: str,
	user: dict,
	title: str,
	album_id: str,
	audio_url: str,
	image_url: str | None,
	artist_name: str,
	is_published: bool,
) -> dict:
	payload = {
		"title": title,
		"created_by": user["id"],
		"album_id": album_id,
		"audio_url": audio_url,
		"image_url": image_url,
		"is_published": is_published,
		"artist_name": artist_name,
	}
	response = client.post(
		f"{BACKEND_URL}/tracks/upload",
		json=payload,
		headers={"Authorization": f"Bearer {access_token}"},
	)
	response.raise_for_status()
	return response.json()


def import_album_url(
	client: httpx.Client,
	access_token: str,
	user: dict,
	url: str,
	is_published: bool,
) -> None:
	metadata = fetch_playlist_metadata(url)
	album_title = normalize_album_title(metadata.get("title") or "Unknown Album")
	artist_name = extract_artist_name(metadata)
	album_folder_name = sanitize_path_part(album_title)
	album_dir = DOWNLOADS_DIR / album_folder_name

	print(f"Downloading '{album_title}' into {album_dir}")
	downloaded_tracks = download_playlist(url, album_dir)
	if not downloaded_tracks:
		raise RuntimeError(f"No tracks were downloaded for {url}")

	cover_path = resolve_cover_path(metadata, album_dir)
	user_folder = user["id"]

	album_image_url = None
	if cover_path:
		cover_file_name = f"{album_folder_name}{cover_path.suffix.lower()}"
		album_image_url = upload_file_to_storage(
			client,
			access_token,
			ALBUM_COVER_BUCKET,
			cover_path,
			f"{user_folder}/{cover_file_name}",
		)

	album = create_album(
		client,
		access_token,
		user,
		album_title,
		album_image_url,
		artist_name,
		is_published,
	)
	print(f"Created album '{album['title']}' ({album['id']})")
	track_image_url = album.get("image_url") or album_image_url

	metadata_entries = metadata.get("entries") or []
	for index, audio_path in enumerate(downloaded_tracks):
		track_title = audio_path.stem
		if index < len(metadata_entries):
			track_title = metadata_entries[index].get("title") or track_title

		audio_public_url = upload_file_to_storage(
			client,
			access_token,
			TRACK_AUDIO_BUCKET,
			audio_path,
			f"{user_folder}/{audio_path.name}",
		)

		track = create_track(
			client,
			access_token,
			user,
			track_title,
			album["id"],
			audio_public_url,
			track_image_url,
			artist_name,
			is_published,
		)
		print(f"Created track '{track['title']}' ({track['id']})")


def main() -> None:
	if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
		raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in backend/src/.env")

	email = read_env_or_prompt("SONATA_EMAIL", "Email: ")
	password = read_env_or_prompt("SONATA_PASSWORD", "Password: ", secret=True)
	publish_imports = os.getenv("SONATA_PUBLISH_IMPORTS", "true").strip().lower() == "true"
	list_of_urls = get_input_urls()

	with httpx.Client(timeout=120.0, follow_redirects=True) as client:
		access_token = login(client, email, password)
		user = get_current_user(client, access_token)

		for url in list_of_urls:
			import_album_url(
				client,
				access_token,
				user,
				url,
				publish_imports,
			)


if __name__ == "__main__":
	main()
