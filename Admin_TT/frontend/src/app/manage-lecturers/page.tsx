"use client";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ManageCandidatesPage() {
  const router = useRouter();
  const toast = useToast();
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // Fetch lecturers and courses
  useEffect(() => {
    const fetchLecturers = async () => {
      const res = await fetch("http://localhost:3001/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              users {
                id
                email
                role
              }
            }
          `,
        }),
      });
      const { data } = await res.json();
      setLecturers(
        (data?.users || []).filter((u: any) => u.role === "Lecturer")
      );
    };

    const fetchCourses = async () => {
      const res = await fetch("http://localhost:3001/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              courses {
                courseCode
                courseName
              }
            }
          `,
        }),
      });
      const { data } = await res.json();
      setCourses(data?.courses || []);
    };

    fetchLecturers();
    fetchCourses();
  }, []);

  // Assign lecturer to course
  const handleAssign = async () => {
    const assigned = courses.some(
    (c) => c.Lecturer && c.Lecturer.toLowerCase() === selectedLecturer.toLowerCase()
  );
  if (assigned) {
    toast({
      title: "Lecturer already assigned",
      description: "This lecturer is already assigned to a course.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }
    if (!selectedLecturer || !selectedCourse) {
      toast({
        title: "Select both lecturer and course",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    await fetch("http://localhost:3001/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation($courseCode: String!, $Lecturer: String!) {
            assignLecturerToCourse(courseCode: $courseCode, Lecturer: $Lecturer) {
              courseCode
              courseName
              Lecturer
            }
          }
        `,
        variables: { courseCode: selectedCourse, Lecturer: selectedLecturer },
      }),
    });
    toast({
      title: "Lecturer assigned",
      description: `Lecturer has been assigned to the course ${selectedCourse}.`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    setSelectedLecturer("");
    setSelectedCourse("");
  };

  return (
    <>
      <Flex direction="column" minH="100vh">
        <Header />
        <Flex
          flex="1"
          justifyContent="center"
          alignItems="center"
          bg="gray.100"
        >
          <Box
            maxW="600px"
            w="full"
            p={8}
            bg="white"
            borderRadius="md"
            boxShadow="lg"
          >
            <Heading
              as="h1"
              size="2xl"
              fontWeight={"extrabold"}
              mb={4}
              color="blue.700"
              textAlign="center"
            >
              MANAGING LECTURERS
            </Heading>
            <Button
              colorScheme="gray"
              variant="outline"
              alignContent={"center"}
              padding={2}
              top={2}
              mb={6}
              onClick={() => router.push("/admin")}
            >
              ← Back to Dashboard
            </Button>
            <Stack spacing={4} mt={8}>
              <Select
                placeholder="Select Lecturer"
                value={selectedLecturer}
                onChange={(e) => setSelectedLecturer(e.target.value)}
              >
                {lecturers.map((l) => (
                  <option key={l.id} value={l.email}>
                    {l.email}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="Select Course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((c) => (
                  <option key={c.courseCode} value={c.courseCode}>
                    {c.courseName} ({c.courseCode})
                  </option>
                ))}
              </Select>
              <Button colorScheme="blue" onClick={handleAssign}>
                Assign Lecturer to Course
              </Button>
            </Stack>
          </Box>
        </Flex>
        <Footer />
      </Flex>
    </>
  );
}
