import './App.css'
import Navbar from './components/Navbar.jsx'
import MediaPlayer from './components/MediaPlayer.jsx'
import { useAudio } from './context/AudioContext.jsx';
//import for mock track, will be removed when real data is integrated from backend
import violentCrimesArt from './assets/imgs/violent_crimes.webp';
import violentCrimesAudio from './assets/audio/violent_crimes.mp3';

function App() {
  const { playTrack } = useAudio();

  //mock track for testing player logic, will be replaced with real data from backend later
  const testTrack = {
    id: 1,
    title: "Violent Crimes",
    artist: "Kanye West",
    imageUrl: violentCrimesArt,
    url: violentCrimesAudio
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-3xl font-bold text-white">Welcome to Sonata</h1>
        <p className="mt-4 text-white/70">Click below to test the player logic.</p>
        
        <button 
          className="btn btn-primary mt-6" 
          onClick={() => playTrack(testTrack)}
        >
          Play Test Track
        </button>
      </main>

      <MediaPlayer />
    </div>
  )
}

export default App;