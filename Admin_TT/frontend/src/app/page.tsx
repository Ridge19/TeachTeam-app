// ADMIN LOGIN PAGE FOR ADMINISTRATOR TO LOGIN
// frontend/src/app/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@rmit.edu.au");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("http://localhost:3001/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            user { id email role }
            token
            error
          }
        }`,
        variables: { email, password },
      }),
    });
    const { data } = await res.json();
    if (data?.login?.user && data?.login?.token) {
      localStorage.setItem("token", data.login.token);
      toast({
        title: "Login successful",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      router.push("/admin");
    } else {
      setError(data?.login?.error || "Login failed");
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box
        bg="white"
        p={8}
        rounded="md"
        boxShadow="lg"
        w="full"
        maxW="350px"
      >
        <Heading as="h2" size="lg" mb={6} textAlign="center" color="blue.700">
          Admin Login
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4} isInvalid={!!error}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              bg="gray.100"
              required
            />
          </FormControl>
          <FormControl mb={4} isInvalid={!!error}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              bg="gray.100"
              required
            />
            {error && (
              <FormErrorMessage>{error}</FormErrorMessage>
            )}
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            w="full"
            mt={2}
            fontWeight="bold"
          >
            Login
          </Button>
        </form>
      </Box>
    </Flex>
  );
}
