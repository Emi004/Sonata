import MediaPlayer from "../MediaPlayer.jsx";

function TrackPreviewCard({ preview }) {
  const { title, imagePreviewUrl, hasAudio } = preview || {};

  return (
    <div className="w-full bg-base-100 shadow-md rounded-lg p-6 flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Preview</h2>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-lg bg-base-300 overflow-hidden flex items-center justify-center">
          {imagePreviewUrl ? (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img
              src={imagePreviewUrl}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-500">No image</span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{title || "Untitled track"}</span>
          <span className="text-xs text-gray-500 mt-1">
            {hasAudio ? "Audio file selected" : "No audio selected yet"}
          </span>
        </div>
      </div>
      {/* Placeholder for how it would sit above the main media player */}
      <div className="mt-4 border-t border-base-300 pt-4 text-xs text-gray-500">
        This is a preview of how your track card might look in the
        application.
      </div>
    </div>
  );
}

export default TrackPreviewCard;
