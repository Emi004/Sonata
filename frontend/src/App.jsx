import "./App.css";
import MediaPlayer from "./components/MediaPlayer.jsx";
import Navbar from "./components/navbar/Navbar.jsx";
import { useAudio } from "./context/AudioContext.jsx";
//import for mock track, will be removed when real data is integrated from backend
import violentCrimesArt from "./assets/imgs/violent_crimes.webp";
import violentCrimesAudio from "./assets/audio/violent_crimes.mp3";
import Sidebar from "./components/Sidebar.jsx";

function App() {
  const { playTrack } = useAudio();

  const testTrack = {
    id: 1,
    title: "Violent Crimes",
    artist: "Kanye West",
    imageUrl: violentCrimesArt,
    url: violentCrimesAudio,
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-base-100">
      
      <Navbar />

      <div className="flex-1 overflow-hidden">
        <Sidebar>
          <div className="h-full flex flex-col justify-between">
            
            <main className="flex-1 overflow-y-auto p-10 text-center ">
              <h1 className="text-3xl font-bold text-white">Welcome to Sonata</h1>
              <p className="mt-4 text-white/70">
                Click below to test the player logic.
              </p>

              <button
                className="btn btn-primary mt-6"
                onClick={() => playTrack(testTrack)}
              >
                Play Test Track
              </button>
              
              <div className="h-[200vh]"></div> 
            </main>

            <MediaPlayer />
          </div>
        </Sidebar>
      </div>
    </div>
  );
}

export default App;
