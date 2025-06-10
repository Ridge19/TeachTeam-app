"use client";
import {
  Box,
  Heading,
  Button,
  Flex,
  Input,
  Stack,
  Text,
  FormControl,
  FormLabel,
  useToast,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  // Edit modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editCourse, setEditCourse] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");

  // Fetch courses from backend
  const fetchCourses = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Add course
  const handleAdd = async () => {
    if (!newName || !newCode) return;
    // Check if course already exists (case-insensitive)
    const exists = courses.some(
      (c: any) =>
        c.courseCode.toLowerCase() === newCode.toLowerCase() ||
        c.courseName.toLowerCase() === newName.toLowerCase()
    );
    if (exists) {
      toast({
        title: "Course already exists",
        description: "A course with this code or name already exists.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setNewName("");
      setNewCode("");
      return;
    }

    // courseCode and CourseName requirements
    if (newCode.length < 5 || newName.length < 5) {
      toast({
        title: "Invalid input",
        description: "Course code and name must be at least 5 characters long.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!/^[A-Z]{4}\d{4}$/.test(newCode)) {
      toast({
        title: "Invalid course code",
        description:
          "Course code must be in the format XXXX1234 (4 letters followed by 4 digits).",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await fetch("http://localhost:3001/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          mutation($courseCode: String!, $courseName: String!, $Lecturer: String) {
            createCourse(courseCode: $courseCode, courseName: $courseName, Lecturer: $Lecturer) {
              courseCode
              courseName
              Lecturer
            }
          }
        `,
          variables: { courseCode: newCode, courseName: newName }, // Lecturer is optional
        }),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add course.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setNewName("");
    setNewCode("");
    toast({
      title: "Course Added",
      description: `Course ${newName} (${newCode}) has been added successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    fetchCourses();
  };

  // Delete course
  const handleDelete = async (courseCode: string) => {
    await fetch("http://localhost:3001/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation($courseCode: String!) {
            deleteCourse(courseCode: $courseCode)
          }
        `,
        variables: { courseCode },
      }),
    });
    toast({
      title: "Course Deleted",
      description: `Course ${courseCode} has been deleted successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    fetchCourses();
  };

  // Open edit modal
  const openEditModal = (course: any) => {
    setEditCourse(course);
    setEditName(course.courseName);
    setEditCode(course.courseCode);
    onOpen();
  };

  // Save edit
  const handleEditSave = async () => {
    // Validation
    if (!editName || !editCode) {
      toast({
        title: "Invalid input",
        description: "Both fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (editCode.length < 5 || editName.length < 5) {
      toast({
        title: "Invalid input",
        description: "Course code and name must be at least 5 characters long.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!/^[A-Z]{4}\d{4}$/.test(editCode)) {
      toast({
        title: "Invalid course code",
        description:
          "Course code must be in the format XXXX1234 (4 letters followed by 4 digits).",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // Check for duplicate (ignore current course)
    const exists = courses.some(
      (c: any) =>
        (c.courseCode.toLowerCase() === editCode.toLowerCase() ||
          c.courseName.toLowerCase() === editName.toLowerCase()) &&
        c.courseCode !== editCourse.courseCode
    );
    if (exists) {
      toast({
        title: "Course already exists",
        description: "A course with this code or name already exists.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Send update mutation
    await fetch("http://localhost:3001/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
      mutation($oldCourseCode: String!, $newCourseCode: String!, $courseName: String!) {
        updateCourse(oldCourseCode: $oldCourseCode, newCourseCode: $newCourseCode, courseName: $courseName) {
          courseCode
          courseName
        }
      }
    `,
        variables: {
          oldCourseCode: editCourse.courseCode,
          newCourseCode: editCode,
          courseName: editName,
        },
      }),
    });
    toast({
      title: "Course Updated",
      description: `Course has been updated successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
    fetchCourses();
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
              fontWeight="extrabold"
              mb={6}
              color="blue.700"
              textAlign="center"
            >
              MANAGING COURSES
              <Button
                colorScheme="gray"
                variant="outline"
                padding={2}
                top={2}
                mb={6}
                onClick={() => router.push("/admin")}
              >
                ← Back to Dashboard
              </Button>
            </Heading>
            <Box mb={8} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAdd();
                }}
              >
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={4}
                  align="flex-end"
                >
                  <FormControl isRequired>
                    <FormLabel fontWeight="bold" htmlFor="courseName" mb={1}>
                      Course Name
                    </FormLabel>
                    <Input
                      id="courseName"
                      placeholder="Intro to Programming"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontWeight="bold" htmlFor="courseCode" mb={1}>
                      Course Code
                    </FormLabel>
                    <Input
                      id="courseCode"
                      placeholder="e.g. COSC1234"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                    />
                  </FormControl>
                  <Button colorScheme="blue" px={8} type="submit">
                    Add
                  </Button>
                </Stack>
              </form>
            </Box>
            {/* Add scrollable container here */}
            <Box maxH="400px" overflowY="auto" mb={8}>
              {loading ? (
                <Text>Loading...</Text>
              ) : (
                <Stack spacing={3}>
                  {courses.length === 0 ? (
                    <Text color="gray.500" textAlign="center">
                      No courses found.
                    </Text>
                  ) : (
                    courses.map((course: any) => (
                      <Flex
                        key={course.courseCode}
                        align="center"
                        justify="space-between"
                        p={3}
                        borderWidth={1}
                        borderRadius="md"
                        bg="gray.25"
                      >
                        <Box>
                          <Text fontWeight="bold">{course.courseName}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {course.courseCode}
                          </Text>
                        </Box>
                        <Stack direction="row" spacing={2}>
                          <IconButton
                            aria-label="Edit"
                            icon={<EditIcon />}
                            size="sm"
                            colorScheme="yellow"
                            variant="outline"
                            onClick={() => openEditModal(course)}
                          />
                          <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDelete(course.courseCode)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </Flex>
                    ))
                  )}
                </Stack>
              )}
            </Box>
          </Box>
        </Flex>
        <Footer />
      </Flex>
      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Course</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Course Name</FormLabel>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Course Name"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Course Code</FormLabel>
                <Input
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  placeholder="Course Code"
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEditSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
