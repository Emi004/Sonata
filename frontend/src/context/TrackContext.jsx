import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext.jsx";

const TrackContext = createContext();

export const TrackProvider = ({ children }) => {
  const { session, user } = useAuth();

  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const [tracksError, setTracksError] = useState("");
  const [albumsError, setAlbumsError] = useState("");

  const fetchTracks = useCallback(async (name) => {
    setLoadingTracks(true);
    setTracksError("");
    try {
      const url = name
        ? `${import.meta.env.VITE_BACKEND_URL}/tracks?name=${encodeURIComponent(
            name,
          )}`
        : `${import.meta.env.VITE_BACKEND_URL}/tracks`;

      const res = await fetch(url);
      if (!res.ok) {
        const text = await res.text();
        setTracksError(text || "Failed to fetch tracks");
        setTracks([]);
        return;
      }
      const data = await res.json();
      setTracks(Array.isArray(data) ? data : []);
    } catch (_err) {
      setTracksError("Failed to fetch tracks");
      setTracks([]);
    } finally {
      setLoadingTracks(false);
    }
  }, []);

  const fetchAlbumsForArtist = useCallback(
    async (artistId) => {
      const effectiveArtistId = artistId || user?.id;
      if (!effectiveArtistId) return;
      setLoadingAlbums(true);
      setAlbumsError("");
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/albums?artist_id=${effectiveArtistId}`,
          {
            headers: session?.access_token
              ? { Authorization: `Bearer ${session.access_token}` }
              : {},
          },
        );

        if (!res.ok) {
          const text = await res.text();
          setAlbumsError(text || "Failed to fetch albums");
          setAlbums([]);
          return;
        }

        const data = await res.json();
        setAlbums(Array.isArray(data) ? data : []);
      } catch (_err) {
        setAlbumsError("Failed to fetch albums");
        setAlbums([]);
      } finally {
        setLoadingAlbums(false);
      }
    },
    [session?.access_token, user?.id],
  );

  const addTrack = useCallback(
    async ({ title, album_id, audio_url, image_url, is_published }) => {
      if (!user || !session?.access_token) {
        throw new Error("Not authenticated");
      }

      
      const payload = {
        title,
        artist_id: user.id,
        album_id: album_id || null,
        audio_url,
        image_url,
        is_published,
      };

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/tracks/upload`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to add track");
      }

      const created = await res.json();
      // Optional: keep local tracks list in sync
      setTracks((prev) => (Array.isArray(prev) ? [...prev, created] : [created]));
      return created;
    },
    [session?.access_token, user],
  );

  return (
    <TrackContext.Provider
      value={{
        tracks,
        albums,
        loadingTracks,
        loadingAlbums,
        tracksError,
        albumsError,
        fetchTracks,
        fetchAlbumsForArtist,
        addTrack,
      }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export const useTracks = () => useContext(TrackContext);
