// imports 
import React, { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import router, { useRouter } from "next/router";
import {
  Box,
  Input,
  Text,
  Heading,
  VStack,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { DataAPI } from "../services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Use backend types for Applicant and Course
import type { Application as Applicant, Course } from "../services/api";

// modified to fetch courses from the backend (DataAPI.getAllCourses) instead of using a static COURSES array in localstorage
// this allows for dynamic course fetching and ensures that the course names are always up-to-date

const SearchApplicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [courses, setCourses] = useState<Course[]>([]); // Store fetched courses
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);

  // sorting 
  const [selectedAvailability, setSelectedAvailability] = useState('');
  // checkbox state
  const [isChecked, setIsChecked] = useState(false); // Default value

  useEffect(() => {
    // Fetch applications from the backend database
    const fetchApplications = async () => {
      try {
        const data = await DataAPI.getAllApplications();
        setApplicants(data);
        setFilteredApplicants(data);
      } catch (error) {
        setApplicants([]);
        setFilteredApplicants([]);
      }
    };
    fetchApplications();
    // Fetch courses from backend
    const fetchCourses = async () => {
      try {
        const data = await DataAPI.getAllCourses();
        setCourses(data);
      } catch (error) {
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  // function to get course name from course code using fetched courses
  const getCourseName = (code: string): string => {
    const course = courses.find(c => c.courseCode === code);
    return course ? course.courseName : "Unknown Course";
  };

  // checkbox function to sort by course name
  const handleCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsChecked(checked);
  
    if (checked) {
      // Sort by course name (alphabetically)
      const sorted = [...filteredApplicants].sort((a, b) => {
        const nameA = getCourseName(a.courseCode).toLowerCase();
        const nameB = getCourseName(b.courseCode).toLowerCase();
        return nameA.localeCompare(nameB);
      });
      setFilteredApplicants(sorted);
    } else {
      // Reset to original list
      setFilteredApplicants(applicants);
    }
  };

  // handles reset 
  const handleReset = () => {
    setSearchQuery('');
    setSelectedAvailability('');
    setFilteredApplicants(applicants);
    setIsChecked(false);
  }
  

  // handles search functionality (based on name, skills and availability)
  // this function takes an event and filters the applicants array based on the search query
  // it updates the filteredApplicants state with the filtered array
  // it also updates the searchQuery state with the search query

  // search is modified to get course names from the fetched courses instead of using a static COURSES array, which gets it from the backend
  // (dataAPI.getAllCourses)
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);

    const filtered = applicants.filter((applicant) => {
      const courseName = getCourseName(applicant.courseCode).toLowerCase();
      return (
        courseName.includes(value) || // searching course name
        applicant.fullName.toLowerCase().includes(value) ||
        applicant.skills.some(skill => skill.toLowerCase().includes(value)) ||
        applicant.availability.toLowerCase().includes(value) // searching availability
      );
    });

    setFilteredApplicants(filtered);
  };

  return (
    <div className="container">
      <Header />
      <Box p={8}>
        <Heading mb={4}>Search and Sort Applicants</Heading>
        {/* using stats page back button due to similar alignment and position */}
        <button type="button" className="back-button-stats" onClick={() => router.push("/Lecturer")}>Back to Lecturer Page</button>
        <button
          type="button"
          className="reset-button-sort"
          onClick={handleReset}
        >
          Reset All
          {/* reset all button for convenience */}
        </button>
        <select
        // availability filter - part/full time
          className="availability-input"
          value={selectedAvailability}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedAvailability(value);

            if (!value) {
              setFilteredApplicants(applicants); // Reset to all applicants if no filter is selected
              return;
            }

            const filtered = applicants.filter(
              (applicant) => applicant.availability.toLowerCase().includes(value) // Update this if availability is a different field
            );

            setFilteredApplicants(filtered);
          }}
          required
        >
          <option value="">Sorting Options</option>
          <option value="part-time">Part-time</option>
          <option value="full-time">Full-time</option>
        </select>
        <div className = "check-box-sort">
          {/* checkbox to sort by course name (alphabetically) */}
            <input type="checkbox" id="myCheck" checked={isChecked} onChange={handleCheckBox} />
              Sort by Course Name
          </div>
        <Input
          placeholder="Search by name, course name, or skill"
          value={searchQuery}
          onChange={handleSearch}
          mb={6}
          maxW="400px"
        />

          {/* // displays filtered results based on search query and availability */}
        <VStack spacing={4} align="stretch">
          {filteredApplicants.length > 0 ? (
            filteredApplicants.map((applicant, index) => (
              <Card key={index}>
                <CardBody>
                  <Text fontWeight="bold">{applicant.fullName}</Text>
                  <Text>Course Name: {getCourseName(applicant.courseCode)}</Text>
                  <Text>Skills: {Array.isArray(applicant.skills) ? applicant.skills.join(", ") : "None"}</Text>
                  <Text>Availability: {applicant.availability}</Text>
                </CardBody>
              </Card>
            ))
          ) : (
            <Text>No applicants found.</Text>
          )}
        </VStack>
      </Box>
      <Footer />
    </div>
  );
};

export default SearchApplicants;
