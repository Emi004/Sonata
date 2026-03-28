import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTracks } from "../../context/TrackContext.jsx";

function TrackUploadForm({ onPreviewChange, onUploaded }) {
  const { uploadToStorage } = useAuth();
  const {
    albums,
    loadingAlbums,
    albumsError,
    fetchAlbumsForArtist,
    addTrack,
  } = useTracks();

  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAlbumsForArtist();
  }, [fetchAlbumsForArtist]);

  // Update preview whenever local form state changes
  useEffect(() => {
    if (!onPreviewChange) return;

    let imagePreviewUrl = null;
    if (imageFile) {
      imagePreviewUrl = URL.createObjectURL(imageFile);
    }

    onPreviewChange({
      title: title || "Untitled track",
      imagePreviewUrl,
      isPublished,
      hasAudio: !!audioFile,
    });

    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [title, imageFile, isPublished, audioFile, onPreviewChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!audioFile) {
      setError("Please select an audio file.");
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
      if (imageFile) {
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
      });

      setSuccess("Track uploaded successfully.");
      setTitle("");
      setAlbumId("");
      setAudioFile(null);
      setImageFile(null);
      setIsPublished(false);
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

      <div className="form-control">
        <label className="label">
          <span className="label-text">Album</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
        >
          <option value="">No album</option>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.title}
            </option>
          ))}
        </select>
        {loadingAlbums && (
          <span className="text-xs text-gray-500 mt-1">Loading albums...</span>
        )}
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
        />
      </div>

      <div className="form-control flex-row items-center gap-2">
        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        <span className="label-text">Published</span>
      </div>

      {error && (
        <div className="alert alert-error mt-2 text-sm">
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="alert alert-success mt-2 text-sm">
          <span>{success}</span>
        </div>
      )}

      <div className="form-control mt-4">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? "Uploading..." : "Upload Track"}
        </button>
      </div>
    </form>
  );
}

export default TrackUploadForm;
