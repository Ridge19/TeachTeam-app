"use client";
import { Box, Heading, Text, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AssignPage() {
  const router = useRouter();

  return (
    <>
    <Flex direction="column" minH="100vh">
      <Header/>
      <Flex flex="1" justifyContent="center" alignItems="center" bg="gray.100">
      <Box maxW="600px" w="full" p={8} bg="white" borderRadius="md" boxShadow="lg">
        <Heading as="h1" size="5xl" fontWeight={"extrabold"} mb={4} color="blue.700" textAlign="center" style={{fontWeight:2000}}>
          Assign PAGEE
        </Heading>
        
        
      </Box>
      </Flex>
      <Footer/>
      </Flex>
    </>
  );
}
