import { useAudio } from "../context/AudioContext";
import { useState } from "react";

function MediaPlayer() {
  const {
    isPlaying,
    togglePlay,
    currentTrack,
    volume,
    setVolume,
    currentTime,
    duration,
    formatTime,
    seek,
  } = useAudio();

  const [showVolume, setShowVolume] = useState(false);

  const toggleVolumeSlider = () => {
    setShowVolume(!showVolume);
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 p-4">
      <div className="max-w-5xl mx-auto bg-base-200/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-base-300 flex items-center gap-6 px-6 py-3">
        <div className="flex items-center gap-3 min-w-[180px]">
          <img
            src={currentTrack.imageUrl}
            alt="artwork"
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex flex-col text-white">
            <span className="text-sm font-semibold">{currentTrack.title}</span>
            <span className="text-xs opacity-70">{currentTrack.artist}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-xs text-white/70">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={Number.isFinite(currentTime) ? currentTime : 0}
            onChange={(e) => seek(Number(e.target.value))}
            className="range range-xs range-accent w-full "
          />
        </div>

        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="btn btn-circle">
            {isPlaying ? (
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5 4l15 8-15 8V4z" />
              </svg>
            )}
          </button>
          <button className="btn btn-circle" onClick={toggleVolumeSlider}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
              />
            </svg>
          </button>
          <div
            className={`transition-all duration-300 overflow-hidden ${showVolume ? "w-24 opacity-100" : "w-0 opacity-0"}`}
          >
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="range range-xs range-accent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaPlayer;
