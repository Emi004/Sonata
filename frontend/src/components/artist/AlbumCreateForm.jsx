import { useEffect, useState } from "react";
import { useTracks } from "../../context/TrackContext.jsx";
import { useAuth } from "../../context/AuthContext";

function AlbumCreateForm({ onPreviewChange }) {
  const { createAlbum } = useTracks();
  const { uploadToStorage, user } = useAuth();

  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [artistName, setArtistName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!onPreviewChange) return;

    let imagePreviewUrl = null;
    if (imageFile) {
      imagePreviewUrl = URL.createObjectURL(imageFile);
    }

    onPreviewChange({
      title: title || "Untitled album",
      imagePreviewUrl,
      isPublished,
      hasAudio: false,
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
  }, [title, imageFile, isPublished, artistName, user, onPreviewChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (user?.is_admin && !artistName.trim()) {
      setError("Artist name is required for admins.");
      return;
    }

    setSubmitting(true);
    try {
      let uploadedImageUrl = null;
      if (imageFile) {
        uploadedImageUrl = await uploadToStorage(imageFile, "album/cover");
        if (!uploadedImageUrl) {
          setError("Failed to upload album cover.");
          setSubmitting(false);
          return;
        }
      }

      await createAlbum({
        title: title.trim(),
        image_url: uploadedImageUrl,
        is_published: isPublished,
        // For admins, use the typed name; for artists, backend will use username
        artist_name: user?.is_admin ? artistName.trim() : undefined,
      });

      setSuccess("Album created successfully.");
      setTitle("");
      setImageFile(null);
      setIsPublished(false);
      setArtistName("");
    } catch (err) {
      setError(err.message || "Unexpected error while creating album.");
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
          <span className="label-text">Album title</span>
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
          <span className="label-text">Cover image (optional)</span>
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
          {submitting ? "Creating album..." : "Create Album"}
        </button>
      </div>
    </form>
  );
}

export default AlbumCreateForm;
