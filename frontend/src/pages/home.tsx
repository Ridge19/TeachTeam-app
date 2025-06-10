// TUTORS PAGE
//show available courses and - apply now
// NOTHING HAS CHANGED

import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import { FormControl, Select } from "@chakra-ui/react";
import  { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Course} from "../types/courses"; // Import the COURSES array
import { DataAPI } from "../services/api";

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
  const [showForm, setShowForm] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    // Fetch profiles on component mount
    useEffect(() => {
      fetchCourses();
    }, []);
  
    const fetchCourses = async () => {
      try {
        const data = await DataAPI.getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching Courses:", error);
      }
    }

  //WHEN THE APPLICANT (TUTOR CLICKS ON APPLY NOW)
  //This routes the applicant to the application page and sends the coursecode as the query 
    const applyNow = (course: Course) => {
      setSelectedCourse(course);
      router.push({
        pathname:'/application',
        query: {courseCode : course.courseCode}
    });
    };
  
  return (
    <div className="container">
      <Header />
      <br></br>

      {/* 👇 Courses moved into a wrapper */}
      <h3 style={{ color: 'navy', fontSize: '1.5rem', textAlign: 'center' }}>
        Welcome {user?.email}! </h3>
      <h3 style = {{ color:'navy',fontSize: '1.5rem'}}>Explore Available Courses </h3>
      <button 
        type="button"
        className="view-profile"
        onClick={() => router.push('/profile')}
        style={{ backgroundColor: 'navy', color: 'white', padding: '10px 20px', borderRadius: '5px' }}
      >
        View Profile
      </button>
      <div className="course-wrapper"> 
        {/* Displaying Each of the available courses */}
        {courses.map((course) => (
        <div key={course.courseCode} className="course-card">
          <h4>{course.courseCode}</h4>
          <br></br>
          <h3>{course.courseName}</h3>

          <br></br>
          <button
                type="button"
                className="card-btn"
                 onClick={() => applyNow(course)} 
              >
                APPLY NOW!
              </button>
        </div>
      ))}
      </div>
      <main className="main-content">
        <Head>
          <title>Assignment 1</title>
          <meta name="description" content="Assignment 1" />
        </Head>
      </main>

      <Footer />
    </div>
  );
}