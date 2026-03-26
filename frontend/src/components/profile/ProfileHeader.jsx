import { useEffect, useRef, useState } from "react";
import { default_pfp } from "../../assets/imgs/image";

function ProfileHeader({ session, user, loading, updateUser, uploadToStorage }) {
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const fileInputRef = useRef(null);

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const handleUsernameChange = async () => {
    const current = user?.username || "";
    const trimmed = newUsername.trim();

    if (!trimmed || trimmed === current) {
      setNewUsername(current);
      toggleEditing();
      return;
    }

    const { error } = await updateUser({
      username: trimmed,
      accessToken: session?.access_token,
    });

    if (!error) {
      toggleEditing();
    } else {
      console.error("Failed to update user:", error);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const avatarUrl = await uploadToStorage(file, "image");
    if (avatarUrl) {
      const { error } = await updateUser({
        avatarUrl,
        accessToken: session?.access_token,
      });

      if (error) {
        console.error("Failed to update avatar:", error);
      }
    } else {
      console.error("Failed to upload avatar");
    }
  };

  useEffect(() => {
    setNewUsername(user?.username || "");
  }, [user]);

  return (
    <div className="flex items-end gap-4">
      <div className="avatar flex flex-col items-center hover:cursor-pointer shrink-0">
        <button
          type="button"
          className="ring-accent ring-offset-base-100 rounded-full ring-2 ring-offset-2 overflow-hidden"
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          <img
            src={loading ? default_pfp : user?.avatarUrl}
            className="w-20 h-20 rounded-full object-cover"
          />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {editing ? (
            <input
              type="text"
              value={newUsername}
              className="input input-ghost text-2xl px-2 h-auto py-1"
              onChange={(e) => setNewUsername(e.target.value)}
            />
          ) : (
            <p className="text-2xl font-bold">
              {loading ? "Loading..." : user?.username}
            </p>
          )}
          <button
            className="btn btn-circle btn-ghost btn-sm"
            onClick={editing ? handleUsernameChange : toggleEditing}
          >
            {editing ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687 1.687a1.5 1.5 0 010 2.121l-8.25 8.25a1.5 1.5 0 01-.53.35l-3.375 1.125a.75.75 0 01-.948-.948l1.125-3.375a1.5 1.5 0 01.35-.53l8.25-8.25a1.5 1.5 0 012.121 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 19.5h-6"
                />
              </svg>
            )}
          </button>
        </div>
        <p className="text-sm text-base-content/60">{session?.user?.email}</p>
      </div>
    </div>
  );
}

export default ProfileHeader;
