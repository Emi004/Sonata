import { useTracks } from "../../context/TrackContext.jsx";
import { useEffect } from "react";

function UnpublishedTracksList() {
  const { tracks, loadingTracks, tracksError, fetchTracks, publishTrack } =
    useTracks();

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const unpublished = Array.isArray(tracks)
    ? tracks.filter((t) => !t.is_published)
    : [];

  const handlePublish = async (track) => {
    try {
      await publishTrack(track);
      await fetchTracks();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full bg-base-100 shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Unpublished tracks</h2>

      {loadingTracks && (
        <div className="text-sm text-gray-500">Loading tracks...</div>
      )}
      {tracksError && (
        <div className="text-sm text-error mb-2">{tracksError}</div>
      )}

      {unpublished.length === 0 && !loadingTracks && !tracksError && (
        <div className="text-sm text-gray-500">
          You have no unpublished tracks yet.
        </div>
      )}

      <ul className="space-y-2">
        {unpublished.map((track) => (
          <li
            key={track.id}
            className="group flex items-center justify-between rounded-md border border-base-300 px-3 py-2 text-sm relative"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-base-300 overflow-hidden flex items-center justify-center">
                {track.image_url ? (
                  // eslint-disable-next-line jsx-a11y/img-redundant-alt
                  <img
                    src={track.image_url}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-gray-500">No image</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium line-clamp-1">{track.title}</span>
                <span className="text-[11px] text-gray-500">Draft</span>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 transition-opacity group-hover:opacity-0">
              Not published
            </span>
            <button
              type="button"
              onClick={() => handlePublish(track)}
              className="btn btn-xs btn-success absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Publish
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UnpublishedTracksList;
