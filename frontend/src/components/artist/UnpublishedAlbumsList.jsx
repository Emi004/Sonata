import { useEffect } from "react";
import { useTracks } from "../../context/TrackContext.jsx";

function UnpublishedAlbumsList() {
  const { albums, loadingAlbums, albumsError, fetchAlbumsForArtist, publishAlbum } =
    useTracks();

  useEffect(() => {
    fetchAlbumsForArtist();
  }, [fetchAlbumsForArtist]);

  const unpublished = Array.isArray(albums)
    ? albums.filter((a) => !a.is_published)
    : [];

  const handlePublish = async (album) => {
    try {
      await publishAlbum(album);
      await fetchAlbumsForArtist();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full bg-base-100 shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Unpublished albums</h2>

      {loadingAlbums && (
        <div className="text-sm text-gray-500">Loading albums...</div>
      )}
      {albumsError && (
        <div className="text-sm text-error mb-2">{albumsError}</div>
      )}

      {unpublished.length === 0 && !loadingAlbums && !albumsError && (
        <div className="text-sm text-gray-500">
          You have no unpublished albums yet.
        </div>
      )}

      <ul className="space-y-2">
        {unpublished.map((album) => (
          <li
            key={album.id}
            className="group flex items-center justify-between rounded-md border border-base-300 px-3 py-2 text-sm relative"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-base-300 overflow-hidden flex items-center justify-center">
                {album.image_url ? (
                  <img
                    src={album.image_url}
                    alt="Album cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-gray-500">No image</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium line-clamp-1">{album.title}</span>
                <span className="text-[11px] text-gray-500">Draft</span>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 transition-opacity group-hover:opacity-0">
              Not published
            </span>
            <button
              type="button"
              onClick={() => handlePublish(album)}
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

export default UnpublishedAlbumsList;
