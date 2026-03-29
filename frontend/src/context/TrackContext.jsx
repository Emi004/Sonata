import { createContext, useCallback, useContext, useEffect, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTracks = useCallback(async (name) => {
    setLoadingTracks(true);
    setTracksError("");
    try {
      if (name) {
        const encodedName = encodeURIComponent(name);
        const [titleRes, artistRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/tracks?name=${encodedName}`),
          fetch(
            `${import.meta.env.VITE_BACKEND_URL}/tracks/by-artist?artist_name=${encodedName}`,
          ),
        ]);

        if (!titleRes.ok || !artistRes.ok) {
          const text = !titleRes.ok ? await titleRes.text() : await artistRes.text();
          setTracksError(text || "Failed to fetch tracks");
          setTracks([]);
          return;
        }

        const [titleData, artistData] = await Promise.all([
          titleRes.json(),
          artistRes.json(),
        ]);

        const mergedTracks = [...(Array.isArray(titleData) ? titleData : []), ...(Array.isArray(artistData) ? artistData : [])];
        const dedupedTracks = Array.from(
          new Map(mergedTracks.map((track) => [track.id, track])).values(),
        );
        setTracks(dedupedTracks);
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tracks`);
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

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const trimmedQuery = searchQuery.trim();
      fetchTracks(trimmedQuery || undefined);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [fetchTracks, searchQuery]);

  const searchSuggestions = searchQuery.trim()
    ? tracks
        .filter((track) => track.is_published)
        .slice(0, 2)
        .map((track) => ({
          id: track.id,
          title: track.title,
          artist_name: track.artist_name || "Unknown artist",
          image_url: track.image_url || null,
        }))
    : [];

  const fetchAlbumsForArtist = useCallback(
    async (artistName) => {
      const effectiveArtistName = artistName || user?.username;
      if (!effectiveArtistName) return;
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
          (album) => String(album.artist_name) === String(effectiveArtistName),
        );
        setAlbums(filtered);
      } catch (_err) {
        setAlbumsError("Failed to fetch albums");
        setAlbums([]);
      } finally {
        setLoadingAlbums(false);
      }
    },
    [session?.access_token, user?.username],
  );

  const updateTrack = useCallback(
    async (
      trackId,
      { title, created_by,album_id, audio_url, image_url, is_published, artist_name },
    ) => {
      if (!user || !session?.access_token) {
        throw new Error("Not authenticated");
      }

      const payload = {
        title,
        created_by: created_by || user.id,
        album_id: album_id || null,
        audio_url,
        image_url,
        is_published,
        artist_name,
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
      async (albumId, { title, image_url, is_published, artist_name, created_by }) => {
        if (!user || !session?.access_token) {
          throw new Error("Not authenticated");
        }
            
        const payload = {
          title,
          created_by: created_by || user.id,
          image_url: image_url || null,
          is_published,
          artist_name,
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
    async ({ title, album_id, audio_url, image_url, is_published, artist_name, created_by  }) => {
      if (!user || !session?.access_token) {
        throw new Error("Not authenticated");
      }

      
      const payload = {
        title,
        created_by: created_by || user.id,
        album_id: album_id || null,
        audio_url,
        image_url,
        is_published,
        artist_name,
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
        album_id: track.album_id ?? null,
        audio_url: track.audio_url,
        image_url: track.image_url ?? null,
        is_published: true,
        artist_name: track.artist_name,
        created_by: track.created_by,
      });
    },
    [updateTrack],
  );

  const publishAlbum = useCallback(
    async (album) => {
      return updateAlbum(album.id, {
        title: album.title,
        image_url: album.image_url ?? null,
        is_published: true,
        artist_name: album.artist_name,
        created_by: album.created_by,
      });
    },
    [updateAlbum],
  );

  const createAlbum = useCallback(
    async ({ title, image_url, is_published, artist_name, created_by }) => {
      if (!user || !session?.access_token) {
        throw new Error("Not authenticated");
      }

      const payload = {
        title,
        image_url: image_url || null,
        is_published,
        artist_name,
        created_by: created_by || user.id,
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
        searchQuery,
        setSearchQuery,
        searchSuggestions,
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
