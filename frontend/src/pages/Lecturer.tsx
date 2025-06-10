// imports
import React, { useState, useEffect, useRef } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import {
  FormControl,
  Button,
  Input,
  Textarea,
  Box,
  Select,
  Flex,
  useToast,
  SimpleGrid,
  Toast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PieChart } from "../components/PieChart";
import { useAuth } from "@/context/AuthContext";

import { APPLICATIONS } from "@/types/applications";
import { COURSES } from "@/types/courses";

import { generateApplicationId } from "@/utils/idGenerator"; // Function to generate unique application ID
import { DataAPI } from "@/services/api";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// LECTURERS PAGE. responsible for displaying the applicants and allowing the lecturer to select and rank them
// it uses the Chakra UI library to display the applicants in a responsive way.
// it also uses the PieChart component to display the pie chart and the applications data to display the statistics.
// there is also a search and sort page so the tutor can search and sort the applicants based on their skills, course code, and other criteria.
// it does calculations based on the selectedCandidates array and the finalSelectedCandidates array to display the statistics.
// modified to cal DataAPI.signin() and DataAPI.getCurrentUser() methods
// modified to get applications from the backend using DataAPI.getAllApplications() method.

const Applicant = () => {
  // declarations
  const toast = useToast();
  const router = useRouter();
  const { user } = useAuth(); // Add this to get the current user

  const [courseFilter, setCourseFilter] = useState<string>("");
  const [rank, setRank] = useState<number | string>("");
  const [comment, setComment] = useState<string>("");
  const [activeApplicantId, setActiveApplicantId] = useState<string | null>(
    null
  );
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>("");

  const [finalSelectedCandidates, setFinalSelectedCandidates] = useState<any[]>(
    []
  );
  const [rankDistribution, setRankDistribution] = useState<{
    [rank: number]: number;
  }>({});

  const [courses, setCourses] = useState<any[]>([]); // Add courses state
  const [users, setUsers] = useState<any[]>([]); // Add users state
  const [applications, setApplications] = useState<any[]>([]); // Add applications state
  const [selectedApplication, setSelectedApplication] = useState<any | null>(
    null
  ); // Track selected application

  const resetForm = () => {
    setRank("");
    setComment("");
    setActiveApplicantId(null);
  };

  // Persist finalSelectedCandidates to localStorage on change
  useEffect(() => {
    localStorage.setItem(
      "finalSelectedCandidates",
      JSON.stringify(finalSelectedCandidates)
    );
  }, [finalSelectedCandidates]);

  // Restore finalSelectedCandidates from localStorage on mount (only once)
  useEffect(() => {
    // Only restore if not already set (avoid overwriting)
    if (finalSelectedCandidates.length === 0) {
      const storedFinal = localStorage.getItem("finalSelectedCandidates");
      if (storedFinal) {
        try {
          const parsed = JSON.parse(storedFinal);
          if (Array.isArray(parsed)) {
            setFinalSelectedCandidates(parsed);
          }
        } catch (e) {
          // If corrupted, clear it
          localStorage.removeItem("finalSelectedCandidates");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch users, courses, and applications on component mount
  useEffect(() => {
    fetchUsers();
    if (typeof fetchCourses === "function") fetchCourses();
    if (typeof fetchApplications === "function") fetchApplications();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await DataAPI.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching Users:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await DataAPI.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching Courses:", error);
    }
  };

  const fetchApplications = async () => {
    try {
      const data = await DataAPI.getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching Applications:", error);
    }
  };

  // Calculate rank distribution
  useEffect(() => {
    const rankCounts: { [rank: number]: number } = {};
    finalSelectedCandidates.forEach((candidate) => {
      const r = Number(candidate.rank);
      if (r >= 1 && r <= 5) rankCounts[r] = (rankCounts[r] || 0) + 1;
    });
    setRankDistribution(rankCounts);
  }, [finalSelectedCandidates]);

  // Pie chart instance
  const filteredApplications = APPLICATIONS.filter(
    (a) => a.courseCode === courseFilter
  );

  const handleCourseFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedApplicationId(e.target.value);
    resetForm(); // Reset on application change
    const app = applications.find((a) => String(a.applicationId) === e.target.value);
    setSelectedApplication(app || null);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleToggleRankSection = (appId: string) => {
    setActiveApplicantId((prev) => (prev === appId ? null : appId));
    setRank("");
    setComment("");
  };

  const clearFields = () => {
    setRank("");
    setComment("");
    setActiveApplicantId(null);
  };

  const removeSelectedCandidate = (email: string) => {
    setFinalSelectedCandidates((prev) =>
      prev.filter((candidate) => candidate.email !== email)
    );
  };

  return (
    <div className="container">
      <Header />
      <main className="main-content">
        <Flex justifyContent="space-between" flexWrap="wrap">
          <Box mb={4}>
            <p style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
              Lecturer Dashboard
            </p>
            <h3
              style={{ color: "navy", fontSize: "1.5rem", textAlign: "center" }}
            >
              Welcome {user?.email}!{" "}
            </h3>
            <p style={{ fontSize: "1.2rem", marginTop: "0.2rem" }}>
              Select applications to view them. <br />
              To view statistics, click "view statistics" button.<br />
              For information about your profile, click "view profile"
            </p>
          </Box>
          <Flex direction="column" gap={2} ml={{ base: 0, md: 12 }}>
            <Button
              colorScheme="purple"
              onClick={() => router.push("/applicationStats")}
            >
              View Statistics
              {/* view statistics (pie chart) page */}
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => router.push("/SearchApplicants")}
            >
              Search and Sort Applicants
              {/* search and sort page  */}
            </Button>
            <Button colorScheme="green" onClick={() => router.push("/profile")}>
              View Profile
              {/* view profile page */}
            </Button>
          </Flex>
        </Flex>

        <Box my={4}>
          <FormControl>
            <Select
              placeholder="Select an application"
              value={selectedApplicationId}
              onChange={handleCourseFilterChange}
            >
              {applications.map((app) => (
                <option key={app.applicationId} value={app.applicationId}>
                  {app.fullName} - {app.courseCode}
                </option>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Show selected application info */}
        {selectedApplication && (
          <Box
            mb={6}
            p={4}
            borderWidth={1}
            borderRadius="8px"
            boxShadow="md"
            bg="gray.50"
          >
            <h3 style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              Selected Application Information
            </h3>
            <p>
              <strong>Email:</strong> {selectedApplication.email}
            </p>
            <p>
              <strong>Full Name:</strong> {selectedApplication.fullName}
            </p>
            <p>
              <strong>Course Name:</strong> {selectedApplication.courseCode}
            </p>
            <p>
              <strong>Skills:</strong> {selectedApplication.skills?.join(", ")}
            </p>
            <p>
              <strong>Education:</strong> {selectedApplication.academics}
            </p>
            <p>
              <strong>Institution:</strong> {selectedApplication.institution}
            </p>
            <p>
              <strong>Date Applied:</strong>{" "}
              {selectedApplication.applicationDate}
            </p>

            {/* Ranking and comment form for selected application */}
            <FormControl mt={4}>
              <Flex alignItems="center" justifyContent="center">
                <Button
                  size="sm"
                  onClick={() =>
                    setRank((prev) => {
                      const newRank = Math.max(1, Number(prev) - 1);
                      return newRank;
                    })
                  }
                  mr={2}
                  aria-label="Decrement rank"
                >
                  -
                </Button>
                <Input
                  type="number"
                  step="1"
                  min={1}
                  max={5}
                  value={rank}
                  isReadOnly
                  placeholder="Rank (1-5)"
                  width="110px"
                  textAlign="center"
                />
                <Button
                  size="sm"
                  onClick={() =>
                    setRank((prev) => {
                      const newRank = Math.min(5, Number(prev) + 1);
                      return newRank;
                    })
                  }
                  ml={2}
                  aria-label="Increment rank"
                >
                  +
                </Button>
              </Flex>
            </FormControl>
            <FormControl mt={2}>
              <Textarea
                value={comment}
                onChange={handleCommentChange}
                placeholder="Add a comment for this candidate"
                rows={3}
              />
            </FormControl>
            <Button
              mt={3}
              colorScheme="blue"
              onClick={() => {
                // Add directly to finalSelectedCandidates
                if (!selectedApplication) return;
                const rankValue = Number(rank);
                if (rankValue < 1 || rankValue > 5) {
                  toast({
                    title: "Invalid Rank",
                    description: `Rank must be between 1 and 5.`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                  return;
                }
                const alreadyExists = finalSelectedCandidates.some(
                  (c) => c.email === selectedApplication.email
                );
                if (alreadyExists) {
                  toast({
                    title: "Candidate Already Selected",
                    description: `This candidate is already in the final selected list.`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                  return;
                }
                const newCandidate = {
                  applicationId: generateApplicationId(),
                  courseCode: selectedApplication.courseCode,
                  fullName: selectedApplication.fullName,
                  email: selectedApplication.email,
                  jobTitle: selectedApplication.jobTitle || "",
                  company: selectedApplication.company || "",
                  skills: selectedApplication.skills,
                  academics: selectedApplication.academics || "",
                  institution: selectedApplication.institution || "",
                  startDate: selectedApplication.startDate || "",
                  endDate: selectedApplication.endDate || "",
                  applicationDate: new Date().toISOString(),
                  isChecked: selectedApplication.isChecked || false,
                  availability: selectedApplication.availability || "full-time",
                  rank: rankValue,
                  comment: comment,
                };
                setFinalSelectedCandidates((prev) => [...prev, newCandidate]);
                toast({
                  title: "Candidate Added",
                  description: `Candidate added to final selected list!`,
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
                setRank("");
                setComment("");
              }}
            >
              Add to Final Selected
            </Button>
            <Button
                mt={3}
                marginLeft={1}
                colorScheme="gray"
                variant="outline"
                onClick={clearFields}
              >
                Clear Fields
              </Button>
          </Box>
        )}

        <SimpleGrid columns={2} spacing={4}>
          {filteredApplications.map((applicant) => (
            <Box
              key={applicant.email}
              p={4}
              borderWidth={1}
              borderRadius="8px"
              boxShadow="md"
              textAlign="center"
            >
              <h3>Email: {applicant.email}</h3>
              <p>Full Name: {applicant.fullName}</p>
              <p>Course Name: {applicant.courseCode}</p>
              <p>Skills: {applicant.skills.join(", ")}</p>
              <p>Education: {applicant.academics}</p>
              <p>Institution: {applicant.institution}</p>
              <p>Date Applied: {applicant.applicationDate}</p>

              <Box mt={2}>
                {/* form to add comment and rank based on how suited the candidate is  */}
                <Button
                  colorScheme="teal"
                  onClick={() => handleToggleRankSection(applicant.email)}
                >
                  {activeApplicantId === applicant.email
                    ? "Hide Form"
                    : "Rank and Add Comment"}
                </Button>

                {activeApplicantId === applicant.email && (
                  <>
                    <FormControl mt={2}>
                      <Input
                        type="number"
                        step="1"
                        min={1}
                        max={5}
                        value={rank}
                        isReadOnly
                        placeholder="Rank (1-5)"
                      />
                    </FormControl>

                    <FormControl mt={2}>
                      <Textarea
                        value={comment}
                        onChange={handleCommentChange}
                        placeholder="Add a comment for this candidate"
                        rows={4}
                      />
                    </FormControl>

                    <Button
                      mt={2}
                      colorScheme="teal"
                      onClick={() => {
                        // Add directly to finalSelectedCandidates
                        const rankValue = Number(rank);
                        if (rankValue < 1 || rankValue > 5) {
                          toast({
                            title: "Invalid Rank",
                            description: "Rank must be between 1 and 5.",
                            status: "error",
                            duration: 4000,
                            isClosable: false,
                          });
                          return;
                        }
                        const alreadyExists = finalSelectedCandidates.some(
                          (c) => c.email === applicant.email
                        );
                        if (alreadyExists) {
                          toast({
                            title: "Candidate Already Selected",
                            description: "This candidate is already in the final selected list.",
                            status: "warning",
                            duration: 4000,
                            isClosable: false,
                          });
                          return;
                        }
                        const newCandidate = {
                          applicationId: generateApplicationId(),
                          courseCode: applicant.courseCode,
                          fullName: applicant.fullName,
                          email: applicant.email,
                          jobTitle: applicant.jobTitle || "",
                          company: applicant.company || "",
                          skills: applicant.skills,
                          academics: applicant.academics || "",
                          institution: applicant.institution || "",
                          startDate: applicant.startDate || "",
                          endDate: applicant.endDate || "",
                          applicationDate: new Date().toISOString(),
                          isChecked: applicant.isChecked || false,
                          availability: applicant.availability || "full-time",
                          rank: rankValue,
                          comment: comment,
                        };
                        setFinalSelectedCandidates((prev) => [
                          ...prev,
                          newCandidate,
                        ]);
                        toast({
                          title: "Candidate Added",
                          description: "Candidate added to final selected list!",
                          status: "success",
                          duration: 4000,
                          isClosable: false,
                        });
                        setRank("");
                        setComment("");
                      }}
                    >
                      Add to Final Selected
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        {/* Final Selected Candidates */}
        <Flex justifyContent="center" alignItems="flex-start" mt={10} mb={10}>
          <Box
            p={5}
            borderWidth="1px"
            borderRadius="lg"
            backgroundColor="gray.50"
            borderColor="gray.200"
            minWidth="350px"
            maxWidth="900px"
            width="100%"
            mx="auto"
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1.5rem",
                textAlign: "center",
              }}
            >
              Final Selected Candidates
            </h2>
            {finalSelectedCandidates.length > 0 ? (
              <Flex flexWrap="wrap" justifyContent="center" gap={4}>
                {finalSelectedCandidates.map((candidate) => (
                  <Box
                    key={candidate.applicationId}
                    p={4}
                    border="1px"
                    borderRadius="12px"
                    borderColor="gray.300"
                    bg="white"
                    minWidth="250px"
                    maxWidth="350px"
                    width="100%"
                    boxShadow="md"
                    textAlign="left"
                    display="inline-block"
                  >
                    <p>
                      <strong>Course:</strong> {candidate.courseCode}
                    </p>
                    <p>
                      <strong>Name:</strong> {candidate.fullName}
                    </p>
                    <p>
                      <strong>Rank:</strong> {candidate.rank}
                    </p>
                    <p>
                      <strong>Academics:</strong> {candidate.academics}
                    </p>
                    <p>
                      <strong>Comment:</strong> {candidate.comment}
                    </p>
                    <Flex mt={2} gap={2}>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => removeSelectedCandidate(candidate.email)}
                      >
                        Remove
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            ) : (
              <p
                style={{
                  fontStyle: "italic",
                  color: "#666",
                  textAlign: "center",
                }}
              >
                No final selections yet.
              </p>
            )}
          </Box>
        </Flex>
      </main>
      <Footer />
    </div>
  );
};

export default Applicant;
