// header component - copied from assignment 1
// slightly modified to include sign in and sign up buttons via checking session for cookie (isSignedIn = true)
import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  console.log("Header user:", user);
  console.log("Header pathname:", router.pathname);

  const signInPage = () => router.push("/signin");
  const signUpPage = () => router.push("/signup");

  const signOut = () => {
    logout();
    router.push("/");
  };

  const isSignedIn = !!user;
  const showSignOut =
    isSignedIn &&
    (router.pathname === "/Lecturer" || router.pathname === "/home");

  console.log("Header user:", user);
  console.log("Header pathname:", router.pathname);
  console.log("isSignedIn:", isSignedIn);
  console.log("showSignOut:", showSignOut);
  return (
    <header className="header">
      <div className="title">
        <a>TeachTeam</a>
      </div>
      <div className="nav-bar-right">
        {user && (
          <div className="user-info">
            <span>Hello, {user.email}! </span>
            {user?.role && <span>({user.role})</span>}
          </div>
        )}

        {showSignOut && (
          <button className="nav-bar-button" onClick={signOut}>
            Sign Out
          </button>
        )}

        {!isSignedIn && (
          <>
            {router.pathname === "/" && (
              <>
                <button className="nav-bar-button" onClick={signUpPage}>
                  Sign Up
                </button>
                <button className="nav-bar-button" onClick={signInPage}>
                  Sign In
                </button>
              </>
            )}
            {(router.pathname === "/signin" ||
              router.pathname === "/signup") && (
              <button
                className="nav-bar-button"
                onClick={() => router.push("/")}
              >
                Back
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
