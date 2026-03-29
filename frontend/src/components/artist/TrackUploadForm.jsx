import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTracks } from "../../context/TrackContext.jsx";

function TrackUploadForm({ onPreviewChange, onUploaded }) {
  const { uploadToStorage, user } = useAuth();
  const { albums, loadingAlbums, albumsError, fetchAlbumsForArtist, addTrack } =
    useTracks();

  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [artistName, setArtistName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;

    if (user.is_admin) {
      const trimmed = artistName.trim();
      if (trimmed) {
        fetchAlbumsForArtist(trimmed);
      }
    } else {
      fetchAlbumsForArtist();
    }
  }, [fetchAlbumsForArtist, user, artistName]);

  // When an album is chosen, clear any manually selected cover image
  useEffect(() => {
    if (albumId) {
      setImageFile(null);
    }
  }, [albumId]);

  // Update preview whenever local form state changes
  useEffect(() => {
    if (!onPreviewChange) return;

    let imagePreviewUrl = null;
    if (imageFile) {
      imagePreviewUrl = URL.createObjectURL(imageFile);
    } else if (albumId) {
      const selected = albums.find((a) => a.id === albumId);
      if (selected?.image_url) {
        imagePreviewUrl = selected.image_url;
      }
    }

    onPreviewChange({
      title: title || "Untitled track",
      imagePreviewUrl,
      isPublished,
      hasAudio: !!audioFile,
      artist_name:
        user?.is_admin
          ? artistName.trim() || "Unknown artist"
          : user?.username || "Unknown artist",
    });

    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [
    title,
    imageFile,
    albumId,
    albums,
    isPublished,
    audioFile,
    artistName,
    user,
    onPreviewChange,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!audioFile) {
      setError("Please select an audio file.");
      return;
    }

    if (user?.is_admin && !artistName.trim()) {
      setError("Artist name is required for admins.");
      return;
    }

    setSubmitting(true);
    try {
      const audioUrl = await uploadToStorage(audioFile, "tracks/audio");
      if (!audioUrl) {
        setError("Failed to upload audio file.");
        setSubmitting(false);
        return;
      }

      let imageUrl = null;
      if (albumId) {
        const selected = albums.find((a) => a.id === albumId);
        imageUrl = selected?.image_url || null;
      } else if (imageFile) {
        imageUrl = await uploadToStorage(imageFile, "tracks/cover");
        if (!imageUrl) {
          setError("Failed to upload image.");
          setSubmitting(false);
          return;
        }
      }

      await addTrack({
        title,
        album_id: albumId || null,
        audio_url: audioUrl,
        image_url: imageUrl,
        is_published: isPublished,
        artist_name: user?.is_admin ? artistName.trim() : undefined,
        created_by: user?.id,
      });

      setSuccess("Track uploaded successfully.");
      setTitle("");
      setAlbumId("");
      setAudioFile(null);
      setImageFile(null);
      setIsPublished(false);
      setArtistName("");
      if (onUploaded) {
        onUploaded();
      }
    } catch (err) {
      setError(err.message || "Unexpected error while uploading track.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 bg-base-100 shadow-md rounded-lg p-6"
    >
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {user?.is_admin ? (
        <div className="form-control">
          <label className="label">
            <span className="label-text">Artist name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            required
          />
        </div>
      ) : (
        <div className="form-control">
          <label className="label">
            <span className="label-text">Artist</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={user?.username || ""}
            readOnly
          />
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text">Album</span>
        </label>
        {/* Custom dropdown so we can show album images */}
        <div className="dropdown w-full">
          <label
            tabIndex={0}
            className="btn btn-outline w-full justify-between"
          >
            {(() => {
              if (!albumId) {
                return <span className="truncate">No album</span>;
              }
              const selected = albums.find((a) => a.id === albumId);
              if (!selected) {
                return <span className="truncate">No album</span>;
              }
              return (
                <span className="flex items-center gap-3 w-full truncate">
                  <span className="w-8 h-8 rounded bg-base-300 overflow-hidden flex items-center justify-center">
                    {selected.image_url ? (
                      <img
                        src={selected.image_url}
                        alt="Album cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-500">
                        No image
                      </span>
                    )}
                  </span>
                  <span className="truncate text-left">{selected.title}</span>
                </span>
              );
            })()}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box shadow w-full mt-1 max-h-64 overflow-y-auto z-10"
          >
            <li>
              <button type="button" onClick={() => setAlbumId("")}>
                <span className="truncate">No album</span>
              </button>
            </li>
            {albums.map((album) => (
              <li key={album.id}>
                <button
                  type="button"
                  onClick={() => setAlbumId(album.id)}
                  className="flex items-center gap-3"
                >
                  <span className="w-8 h-8 rounded bg-base-300 overflow-hidden flex items-center justify-center">
                    {album.image_url ? (
                      <img
                        src={album.image_url}
                        alt="Album cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-500">
                        No image
                      </span>
                    )}
                  </span>
                  <span className="truncate text-left">{album.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {albumsError && (
          <span className="text-xs text-error mt-1">{albumsError}</span>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Audio file</span>
        </label>
        <input
          type="file"
          accept="audio/*"
          className="file-input file-input-bordered w-full"
          onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Cover image</span>
        </label>
        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          disabled={!!albumId}
        />
        {albumId && (
          <span className="mt-1 text-xs text-gray-500">
            Using the selected album's cover image.
          </span>
        )}
      </div>

      <div className="form-control flex-row items-center gap-2">
        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        <span className="label-text ml-2">Published</span>
      </div>

      {error && (
        <div role="alert" className="alert alert-error alert-soft">
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div role="alert" className="alert alert-success alert-soft">
          <span>{success}</span>
        </div>
      )}

      <div className="form-control mt-4">
        <button
          type="submit"
          className="btn btn-outline btn-primary"
          disabled={submitting}
        >
          {submitting ? "Uploading..." : "Upload Track"}
        </button>
      </div>
    </form>
  );
}

export default TrackUploadForm;
