import { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/Sidebar";
import TrackUploadForm from "../components/artist/TrackUploadForm.jsx";
import TrackPreviewCard from "../components/artist/TrackPreviewCard.jsx";
import UnpublishedTracksList from "../components/artist/UnpublishedTracksList.jsx";
import UnpublishedAlbumsList from "../components/artist/UnpublishedAlbumsList.jsx";
import AlbumCreateForm from "../components/artist/AlbumCreateForm.jsx";

function Artist() {
  const [mode, setMode] = useState("single");
  const [preview, setPreview] = useState({
    title: "Untitled track",
    imagePreviewUrl: null,
    hasAudio: false,
    artist_name: "Unknown artist",
  });

  return (
    <>
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <Sidebar>
          <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] py-8 px-4">
            <div className="w-full flex flex-col gap-3 mb-6">
              <h1 className="text-3xl ml-6 font-bold self-start">Create music</h1>
              <div className="flex gap-2 self-start ml-6">
                <button
                  type="button"
                  className={`btn btn-sm ${mode === "single" ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setMode("single")}
                >
                  Single
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${mode === "album" ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setMode("album")}
                >
                  Album
                </button>
              </div>
              <div className="divider"></div>
            </div>

            {mode === "single" ? (
              <div className="w-full grid gap-6 lg:grid-cols-2">
                <TrackUploadForm
                  onPreviewChange={setPreview}
                />
                <TrackPreviewCard preview={preview} />
              </div>
            ) : (
              <div className="w-full grid gap-6 lg:grid-cols-2">
                <AlbumCreateForm onPreviewChange={setPreview} />
                <TrackPreviewCard preview={preview} />
              </div>
            )}

            <div className="w-full mt-8 grid gap-6 lg:grid-cols-2">
              <UnpublishedTracksList />
              <UnpublishedAlbumsList />
            </div>
          </div>
        </Sidebar>
      </div>
    </>
  );
}

export default Artist;