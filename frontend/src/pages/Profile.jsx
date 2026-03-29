import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar/Navbar";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSectionRow from "../components/profile/ProfileSectionRow";
import Sidebar from "../components/Sidebar";

function Profile() {
  const { session, user, loading, updateUser, uploadToStorage } = useAuth();

  return (
    <>

     
     <Navbar  />
     <Sidebar>
      <main className="bg-base-100 min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
          <ProfileHeader
            session={session}
            user={user}
            loading={loading}
            updateUser={updateUser}
            uploadToStorage={uploadToStorage}
            />

          {/* Content sections as full-width horizontal rows (carousel-like) */}
          <div className="space-y-8">
            <ProfileSectionRow
              title="Playlists"
              description="Your playlists will appear in a wide horizontal row here."
              />
            <ProfileSectionRow
              title="Liked Artists"
              description="Artists you follow will be displayed as cards in this row."
              />
            <ProfileSectionRow
              title="Liked Albums"
              description="Albums you like will appear here in a carousel-style row."
              />
          </div>
        </div>
      </main>
              </Sidebar>
    </>
  );
}

export default Profile;
