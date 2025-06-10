import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Home from "@/pages/home"; 
import { User, DEFAULT_USERS } from "../types/user";
import Applicant from "./Lecturer";

// responsible for rendering the landing page based on user role
// this page is used to check if user is logged in and redirect to the appropriate page based on user role
// if user is not logged in, redirect to sign in page
// if user is logged in, check user role and redirect to Lecturer page if user is a Lecturer or to applicant page if user is an tutor

// NOTHING HAS CHANGED.
const LandingPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Assume role is already part of user object
      setRole(user.role);
      setLoading(false);
    } else {
      router.push("/signin"); // redirect to signin if not logged in
    }
  }, [user]);

  if (loading) return <div>Loading...</div>; // Show loading state while checking user role

  return role === "Teacher" ? <Home /> : <Applicant />; // Render different components based on role
};

export default LandingPage;
