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
          `${import.meta.env.VITE_BACKEND_URL}/albums`,
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
        const all = Array.isArray(data) ? data : [];
        const filtered = all.filter(
          (album) => String(album.artist_id) === String(effectiveArtistId),
        );
        setAlbums(filtered);
      } catch (_err) {
        setAlbumsError("Failed to fetch albums");
        setAlbums([]);
      } finally {
        setLoadingAlbums(false);
      }
    },
    [session?.access_token, user?.id],
  );

  const updateTrack = useCallback(
    async (
      trackId,
      { title, artist_id, album_id, audio_url, image_url, is_published },
    ) => {
      if (!user || !session?.access_token) {
        throw new Error("Not authenticated");
      }

      const payload = {
        title,
        artist_id: artist_id || user.id,
        album_id: album_id || null,
        audio_url,
        image_url,
        is_published,
      };

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/tracks/${trackId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update track");
      }

      const updated = await res.json();
      setTracks((prev) =>
        Array.isArray(prev)
          ? prev.map((t) => (t.id === trackId ? updated : t))
          : [updated],
      );
      return updated;
    },
    [session?.access_token, user],
  );
  
    const updateAlbum = useCallback(
      async (albumId, { title, artist_id, image_url, is_published }) => {
        if (!user || !session?.access_token) {
          throw new Error("Not authenticated");
        }
            
        const payload = {
          title,
          artist_id: artist_id || user.id,
          image_url: image_url || null,
          is_published,
        };
            
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/albums/${albumId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update album");
      }

      const updated = await res.json();
      setAlbums((prev) =>
        Array.isArray(prev)
          ? prev.map((a) => (a.id === albumId ? updated : a))
          : [updated],
      );
      return updated;
    },
    [session?.access_token, user],
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
          method: "POST",
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

  const publishTrack = useCallback(
    async (track) => {
      return updateTrack(track.id, {
        title: track.title,
        artist_id: track.artist_id,
        album_id: track.album_id ?? null,
        audio_url: track.audio_url,
        image_url: track.image_url ?? null,
        is_published: true,
      });
    },
    [updateTrack],
  );

  const publishAlbum = useCallback(
    async (album) => {
      return updateAlbum(album.id, {
        title: album.title,
        artist_id: album.artist_id,
        image_url: album.image_url ?? null,
        is_published: true,
      });
    },
    [updateAlbum],
  );

  const createAlbum = useCallback(
    async ({ title, image_url, is_published }) => {
      if (!user || !session?.access_token) {
        throw new Error("Not authenticated");
      }

      const payload = {
        title,
        artist_id: user.id,
        image_url: image_url || null,
        is_published,
      };

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/albums/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create album");
      }

      const created = await res.json();
      setAlbums((prev) => (Array.isArray(prev) ? [...prev, created] : [created]));
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
        createAlbum,
        updateTrack,
        updateAlbum,
        publishTrack,
        publishAlbum,
      }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export const useTracks = () => useContext(TrackContext);
