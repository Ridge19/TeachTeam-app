import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import { FormControl, Button } from "@chakra-ui/react";
import router, { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "@/context/AuthContext";

// NOTHING HAS CHANGED

// image 
import Image from "/public/teachteam.avif";
// fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push('/signup'); // Navigate to signup page
  };

  const signInPage = (event: React.FormEvent) => {
    event.preventDefault();
    router.push('/signin'); // Navigate
  };
  return (
    <div className="container">
      <Header />
      <main className="main-content">
        <Head>
          <title>TeachTeam Hiring Software</title>
          <meta name="description" content="Description" />
          <link rel="icon" href="/TeachTeamLogo.png" />
        </Head>
        {/* <h2 className="card-title">TeachTeam Hiring Software</h2> */}

        <div className="home-container">

        <div className="image-card">
            <div className="image">
              <img src="TeachTeam.avif" alt="TeachTeam" className="image"/>
            </div>
        </div>
        {/* index page where user can sign up or sign in */}
        <div className = "text-container">
        <p className="p-mainpage">
          Teach Your Students The Right Way!</p>
        <p className="p-mainpage-content">
          TeachTeam is a hiring software that helps you find the best teachers for your school.
          </p>
        <p className="p-mainpage-link">
        <a href="/signup">Sign Up Now!</a>
        </p>
        </div>
        </div>
        <br></br>
      </main>
      <Footer />
    </div>

  );
}

