import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { UserRole } from "../types/user";

const ProfilePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // profile requirement 
  // displays user profile information including email, profile ID, role, and date joined getting it from the user object in AuthContext
  // If not logged in, redirects to signin page

  useEffect(() => {
    if (!user) {
      // If not logged in, redirect to signin
      router.push("/signin");
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Header />
      <main className="main-content">
        <h3 style = {{ color:'navy',fontSize: '1.5rem'}}>Your Profile: </h3>
        <button className="back-button-profile" onClick={() => router.back()}>
          Back
        </button>
        <div className="profile-card">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Profile ID:</strong> {user?.id}</p>
          <p><strong>Signed in as role:</strong> {user?.role}</p>
          <p><strong>Date Joined:</strong> {user?.DateJoined ? new Date(user.DateJoined).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
