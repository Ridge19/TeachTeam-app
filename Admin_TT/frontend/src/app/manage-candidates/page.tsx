"use client";
import { Box, Heading, Text, Button, Flex,  useToast, } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ManageCandidatesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const toast = useToast();
  


    // Fetch candidates from backend
    const fetchCandidates = async () => {
      setLoading(true);
      const res = await fetch("http://localhost:3001/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              users {
                id
                email
                password
                DateJoined
                role
                isBlocked
              }
            }
          `,
        }),
      });
      const { data } = await res.json();
      setCandidates((data?.users || []).filter((user: any) => user.role === "Tutor")); // Assuming that the candidate is a tutor
      setLoading(false);
    };
  
    useEffect(() => {
      fetchCandidates();
    }, []);

    const handleBlockAndUnblock = async (candidate: any) => {
      const mutationName = candidate.isBlocked ? "unblockCandidate" : "blockCandidate";
      const res = await fetch("http://localhost:3001/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation {
              ${mutationName}(id: "${candidate.id}") {
                id
                isBlocked
              }
            }
          `,
          variables : {id: candidate.id,}
        }),
      });

      const { data } = await res.json();
      if (data) {
        toast({
          title: `Candidate ${candidate.isBlocked ? "Candidate has been unblocked" : "Candidate has been blocked"} successfully!`,
          status:  "success",
          duration: 3000,
          isClosable: true,
        });
        fetchCandidates(); // Refresh the list after blocking/unblocking the candidate
      }else{
        toast({
          title: "Error",
          description: "Failed to unblock/block candidate",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }

  return (
    <>
    <Flex direction="column" minH="100vh">
      <Header/>
      <Flex flex="1" justifyContent="center" alignItems="center" bg="gray.100">
      <Box maxW="600px" w="full" p={8} bg="white" borderRadius="md" boxShadow="lg">
        <Heading as="h1" size="5xl" fontWeight={"extrabold"} mb={4} color="blue.700" textAlign="center" style={{fontWeight:2000}}>
          MANAGING CANDIDATES
        </Heading>

        {/*If loading */}
        {loading? (
          <Text fontSize="lg" mb={8} color={"gray.600"}>
            Loading candidates...
          </Text>
        ) : (
          <Text fontSize="lg" mb={8} color={"gray.600"}>
            {candidates.length > 0 ? "List of Candidates:" : "No candidates found."}
          </Text>
        )}

      {/* List of candidates */}
      {candidates.map((candidate) => (
        <Box key={candidate.id} mb={4} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
          <Text fontWeight="bold">{candidate.email}</Text>
          <Text>Date Joined: {candidate.DateJoined}</Text>
          <Text>Status: {candidate.isBlocked ? "Blocked" : "Active"}</Text>
          <Button
            mt={2}
            colorScheme={candidate.isBlocked ? "green" : "red"}
            onClick={() => handleBlockAndUnblock(candidate)}
          >
            {candidate.isBlocked ? "Unblock" : "Block"}
          </Button>
        </Box>
      ))}
      </Box>
      </Flex>
      
      <Footer/>
      </Flex>
    </>
  );
}

