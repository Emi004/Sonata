import MediaPlayer from "../MediaPlayer.jsx";
import { default_cover } from "../../assets/imgs/image.jsx";
import { useAuth } from "../../context/AuthContext.jsx";


function TrackPreviewCard({ preview }) {
  const { title, imagePreviewUrl, hasAudio } = preview || {};
  const {user}=useAuth()

  return (
    <div className="w-full bg-base-100 shadow-md rounded-lg p-6 flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Preview</h2>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-lg bg-base-300 overflow-hidden flex items-center justify-center">
            <img
              src={imagePreviewUrl ? imagePreviewUrl : default_cover}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-medium">{title || "Untitled track"}</span>
          <span className="text-xs text-gray-300">
            {user?.username || "Unknown artist"}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {hasAudio ? "Audio file selected" : ""}
          </span>
        </div>
      </div>
      <div className="mt-4 border-t border-base-300 pt-4 text-xs text-gray-500">
        This is a preview of how your track card might look in the
        application.
      </div>
    </div>
  );
}

export default TrackPreviewCard;
