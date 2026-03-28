import { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/Sidebar";
import TrackUploadForm from "../components/artist/TrackUploadForm.jsx";
import TrackPreviewCard from "../components/artist/TrackPreviewCard.jsx";
import UnpublishedTracksList from "../components/artist/UnpublishedTracksList.jsx";

function Artist() {
  const [preview, setPreview] = useState({
    title: "Untitled track",
    imagePreviewUrl: null,
    hasAudio: false,
  });

  return (
    <>
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <Sidebar>
          <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 self-start">Upload New Track</h1>

            <div className="w-full grid gap-6 lg:grid-cols-2">
              <TrackUploadForm
                onPreviewChange={setPreview}
                onUploaded={() => {
                  // Unpublished list component will refresh via context fetchTracks
                }}
              />
              <TrackPreviewCard preview={preview} />
            </div>

            <UnpublishedTracksList />
          </div>
        </Sidebar>
      </div>
    </>
  );
}

export default Artist;