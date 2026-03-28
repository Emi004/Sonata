import "./App.css";
import { useEffect } from "react";
import MediaPlayer from "./components/MediaPlayer.jsx";
import Navbar from "./components/navbar/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SongCard from "./components/SongCard.jsx";
import { useTracks } from "./context/TrackContext.jsx";

function App() {
  const { tracks, loadingTracks, tracksError, fetchTracks } = useTracks();

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-base-100">
      
      <Navbar />

      <div className="flex-1 overflow-hidden">
        <Sidebar>
          <div className="h-full flex flex-col justify-between">
            
            <main className="flex-1 overflow-y-auto p-10">
              <section className="mt-4">
	     		<div className="divider divider-start text-2xl font-semibold text-white">Songs</div>

                {loadingTracks && (
                  <div className="mt-4 text-sm text-gray-400">Loading songs...</div>
                )}
                {tracksError && !loadingTracks && (
                  <div className="mt-4 text-sm text-error">{tracksError}</div>
                )}

                {!loadingTracks && !tracksError && tracks.length === 0 && (
                  <div className="mt-4 text-sm text-gray-400">
                    No published songs yet.
                  </div>
                )}

                {!loadingTracks && !tracksError && tracks.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7  mt-6 justify-items-center align-items-center">
                    {tracks
                      .filter((track) => track.is_published)
                      .map((track) => (
                        <SongCard
                          key={track.id}
                          song={{
                            id: track.id,
                            title: track.title,
                            artist_name: track.artist_name || "Unknown artist",
                            imageUrl: track.image_url,
                            url: track.audio_url,
                          }}
                        />
                      ))}
                  </div>
                )}
              </section>
            </main>

            <MediaPlayer />
          </div>
        </Sidebar>
      </div>
    </div>
  );
}

export default App;
