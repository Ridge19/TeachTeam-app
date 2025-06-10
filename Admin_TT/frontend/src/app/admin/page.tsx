"use client";
import { Box, Heading, Text, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AdminPage() {
  const router = useRouter();

  return (
    <>
    <Flex direction="column" minH="100vh">
      <Header/>
      <Flex flex="1" justifyContent="center" alignItems="center" bg="gray.100">
      <Box maxW="600px" w="full" p={8} bg="white" borderRadius="md" boxShadow="lg">
        <Heading as="h1" size="5xl" fontWeight={"extrabold"} mb={4} color="blue.700" textAlign="center" style={{fontWeight:2000}}>
          Admin Dashboard
        </Heading>
        <Text fontSize="lg" mb={8} color={"gray.600"}>
          Welcome, Admin! Use the navigation to manage lecturers, courses, and candidates.
        </Text>



          <Text fontSize="lg" mb={8}>
          To Assign Lecturers to courses:
        </Text>
        <button type="button" className="main-button" style = {{marginBottom: "24px"}} onClick={() => router.push("/manage-lecturers")} >
                Manage Lecturers
              </button>


        <Text fontSize="lg" mb={8}>
          To Add/Edit/Delete courses:
        </Text>
        <button type="button" className="main-button" style = {{marginBottom: "24px"}} onClick={() => router.push("/manage-courses")} >
                Manage Courses
              </button>

        <Text fontSize="lg" mb={8}>
          To Block/Unblock login of potential candidates:
        </Text>
        
        <button type="button" className="main-button" style = {{marginBottom: "24px"}} onClick={() => router.push("/manage-candidates")} >
                Manage Candidates
              </button>
        
        
      </Box>
      </Flex>
      <Footer/>
      </Flex>
    </>
  );
}
