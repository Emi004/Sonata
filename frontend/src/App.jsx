import "./App.css";
import { useRef } from "react";
import MediaPlayer from "./components/MediaPlayer.jsx";
import Navbar from "./components/navbar/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SongCard from "./components/SongCard.jsx";
import { useTracks } from "./context/TrackContext.jsx";

function App() {
  const { tracks, loadingTracks, tracksError, searchQuery } = useTracks();
  const carouselRef = useRef(null);

  const publishedTracks = tracks.filter((track) => track.is_published);

  const scrollCarousel = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollAmount = carousel.clientWidth * 0.8;
    carousel.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-base-100">
      
      <Navbar />

      <div className="flex-1 overflow-hidden">
        <Sidebar>
          <div className="h-full flex flex-col justify-between">
            
            <main className="flex-1 overflow-y-auto p-10">
              <section className="mt-4">
       		<div className="flex items-center justify-between gap-4">
       		  <div className="divider divider-start text-2xl font-semibold text-white flex-1">Songs</div>
       		  {!loadingTracks && !tracksError && publishedTracks.length > 0 && (
       		    <div className="flex items-center gap-2">
       		      <button
       		        type="button"
       		        className="btn btn-circle btn-sm btn-outline text-gray-700"
       		        onClick={() => scrollCarousel("left")}
       		        aria-label="Scroll songs left"
       		      >
          		        &lt;
       		      </button>
       		      <button
       		        type="button"
       		        className="btn btn-circle btn-sm btn-outline text-gray-700"
       		        onClick={() => scrollCarousel("right")}
       		        aria-label="Scroll songs right"
       		      >
          		        &gt;
       		      </button>
       		    </div>
       		  )}
       		</div>

                {loadingTracks && (
                  <div className="mt-4 text-sm text-gray-400">Loading songs...</div>
                )}
                {tracksError && !loadingTracks && (
                  <div className="mt-4 text-sm text-error">{tracksError}</div>
                )}

                {!loadingTracks && !tracksError && publishedTracks.length === 0 && (
                  <div className="mt-4 text-sm text-gray-400">
                    {searchQuery.trim()
                      ? "No tracks match your search."
                      : "No published songs yet."}
                  </div>
                )}

                {!loadingTracks && !tracksError && publishedTracks.length > 0 && (
                  <div
                    ref={carouselRef}
                    className="carousel carousel-center w-full space-x-4 rounded-box mt-6 py-2"
                  >
                    {publishedTracks.map((track) => (
                      <div key={track.id} className="carousel-item">
                        <SongCard
                          song={{
                            id: track.id,
                            title: track.title,
                            artist_name: track.artist_name || "Unknown artist",
                            imageUrl: track.image_url,
                            url: track.audio_url,
                          }}
                        />
                      </div>
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
