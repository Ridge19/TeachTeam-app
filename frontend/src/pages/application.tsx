//APPLICATION PAGE
// This is the form used when the tutors want to apply for a job in a course
import { useToast } from "@chakra-ui/react";
import React, { use, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import {COURSES } from "../types/courses";
import { APPLICATIONS } from "@/types/applications";
import { DataAPI } from "../services/api";
import { generateApplicationId } from "@/utils/idGenerator"; // Function to generate unique application ID

export default function ApplicationPage() {
  // declarations
  const router = useRouter();
  const{ courseCode }= router.query;
  const [course, setCourse] = useState<any>(null);
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setjobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [academics, setAcademics] = useState("");
  const [institution, setInstitution] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isChecked, setIsChecked] = useState(false); // Default value
  const [availability, setAvailability] = useState(""); // Default value
  const [applications, setApplications] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Find the course based on the courseCode from the URL

  // Find the course based on the courseCode from the URL
  // const course = React.useMemo(() => { //memoises the course object to avoid unnecessary re-renders
  //   if (router.isReady && courseCode) {
  //     // const foundCourse =  COURSES.find((c) => c.courseCode === courseCode);
  //   console.log("courseCode from URL:", courseCode);
  
  //   }
  //   return undefined;
  // }, [router.isReady, courseCode]);

  useEffect(() => {
    const fetchCourses = async () => {
     if (router.isReady && courseCode) {
      try{
        const data = await DataAPI.getCourseByCode(courseCode as string);
        setCourse(data);
      } catch(err){
        console.error("Failed to fetch course:", err);
        setCourse(null);
      }
    }
  };
  fetchCourses();
  }, [router.isReady, courseCode]);

  // handles submit of form function 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all required fields are filled
    const NewApplication = {
      applicationId: Number(generateApplicationId()), // Ensure this is a number
      courseCode: course.courseCode || "",
      courseName: course.courseName || "",
      fullName,
      email,
      jobTitle,
      company,
      skills: skills.split(",").map((skill) => skill.trim()),
      academics,
      institution,
      startDate,
      endDate: isChecked ? "" : endDate, // If checked, no end date
      applicationDate: new Date().toISOString(), // Save current date as application date
      isChecked,
      availability: availability // Make sure this is a string
    };

    // updates applications array 
    // APPLICATIONS.push(NewApplication); // Add new application to the list
    // localStorage.setItem("applications", JSON.stringify(APPLICATIONS)); // Save to local storage
    

    // alert pop up for successful application
    try{

      await DataAPI.createApplication({
        ...NewApplication,
        applicationId: Number(NewApplication.applicationId)
      });
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted.",
        status: "success",
        duration: 4000,
        isClosable: false,
      });
      router.push("/home");
    } catch (error) {
      console.error("Error creating application:", error);
      toast({
        title: "Application Submission Failed",
        description: "Failed to submit application. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: false,
      });
      return;

    }
    // alert(`Successfully Applied!`);
    // router.push("/home");
  };

  // checkbox function to check if the user is currently working in the role
  const handleCheckBox= (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try { 
      const data = await DataAPI.getAllApplications();
      setApplications(data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch applications");
    }
  };

  const toast = useToast();
  

  return (
    <div className="container">
      <Head>
        <title>Assignment 1</title>
        <meta name="description" content="Assignment 1" />
      </Head>

      <Header />
      {/* The application form */}
      <main className="main-content">
        <div className="apply-card">
          <h2 className="card-title">Applying for</h2> 
            <h2 style = {{fontWeight :'bold', color:'white',fontSize: '1.5rem'}}>{course?.courseCode} {course?.courseName}</h2>
            <br></br>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-control">
              {/* Details of the applicant */}
            <input
                type="Full-Name"
                value={fullName}
                onChange={(e) => setfullName(e.target.value)}
                placeholder="Full Name"
                className="input"
                required
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input"
                required
              />
              
              {/* Previous Roles of the applicant */}
              <h2 className="apply-card-text">Previous Roles (if any)</h2>

                 <input
                type="Job Title"
                value={jobTitle}
                onChange={(e) => setjobTitle(e.target.value)}
                placeholder="Job Title"
                className="input"
                         
                /> 

                <input
                type="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company"
                className="input"          
                /> 

                {/* A checkbox for if the applicant is currently working the role that they described */}
                <div className = "check-box">
                <input type="checkbox" id="myCheck" checked={isChecked} onChange={handleCheckBox} />
                <label htmlFor ="myCheck"  className="apply-card-text">
                    Currently working in this role
                </label>
                 </div>


                <div className = "date-titles "> 
                <span>Start Date </span>

                {!isChecked&&( 
                <span>End Date </span>
                )}

                {/* Start dates and end dates for the previous Roles */}
                </div>
                <div className = "date-boxes">
                <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
                className="input"
                         
                /> 
                {/* If the checkbox is not checked it gives the user the option to enter the end date */}
                {!isChecked&&(            
                <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
                className="input"
                         
                /> 
                )}

                </div>

                {/* Skills */}
                <h2 className="apply-card-text">Skills</h2>
                <input
                type="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="eg: Leadership, Customer Service, Teamwork"
                className="input"
                required
                         
                />  

                {/* Academic credentials */}
                <h2 className="apply-card-text">Academic Credentials</h2>
                <input
                type="academics"
                value={academics}
                onChange={(e) => setAcademics(e.target.value)}
                placeholder="eg: Bachelors Degree in Computer Science"
                className="input"
                required
                         
                /> 

                <input
                type="institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Institution"
                className="input"
                required
                         
                /> 
                {/* Dropdown options for availability */}
                <h2 className="apply-card-text">Availability</h2>
                <select
                className="input"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                required
                >
                {/* <option value="">Select availability</option> */}
                {/* <h2 className="apply-card-text">Availability</h2>
                <select className="input" required> */}
                <option value="">Select availability</option>
                <option value="part-time">Part-time</option>
                <option value="full-time">Full-time</option>
                </select>
              
              <div className="apply-buttons">
              <button type="submit" className="a-submit-button">
                Submit
              </button>

              {/* takes user back to homepage if cancel button is pressed */}
              <button type="button" className="cancel-button" onClick={() => router.push("/home")}> 
                Cancel
              </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}