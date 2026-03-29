import { useAudio } from "../context/AudioContext.jsx";

function SongCard({ song }) {
  const { playTrack } = useAudio();

  if (!song) return null;

  return (
    <div
      className="card bg-transparent w-50 shadow-md rounded-lg hover:shadow-xl transition-all  cursor-pointer hover:w-51"
      onClick={() => playTrack(song)}
    >
      <figure className="overflow-hidden rounded-t-md aspect-square w-full">
        <img
          className="w-full h-full object-cover rounded-2xl"
          src={song.imageUrl}
          alt={song.title}
        />
      </figure>
      <div className="card-body p-3">
        <h2 className="card-title text-sm font-semibold truncate">
          {song.title}
        </h2>
        <p className="text-xs text-gray-400 truncate">{song.artist_name}</p>
      </div>
    </div>
  );
}

export default SongCard;
