import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Select,
  Code,
  HStack,
  Tooltip,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

// modified to use an API (DataAPI.createUser) to handle user creation instead of a local createUser function, then verifies with AuthContext
// this allows for better security and flexibility in handling user creation and validation
// also modified to handle user roles and redirect based on role after creation, 
// and verifies using a custom made API via DataAPI.getAllUsers() and DataAPI.createUser() methods.
// This page is used for user registration, allowing users to create accounts with roles (Tutor or Lecturer).
// It includes a form for email, password, and role selection, with validation for existing users and password strength.

import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DataAPI } from "../services/api";
import { User, UserRole } from "../types/user";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // show / hide password 
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    role: UserRole;
  }>({
    email: "",
    password: "",
    role: UserRole.Tutor, // or UserRole.Lecturer
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await DataAPI.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const toast = useToast();

const handleCreateUser = async (e: React.FormEvent) => {
  e.preventDefault();

  // Adjust for case & correct property (if your user object uses `Email`)
  const existingUser = users.find (
    (user) => user.email.toLowerCase() === formData.email.toLowerCase()
  );

  if (existingUser) {
    toast({
      title: "Registration failed",
      description: "A user with this email already exists.",
      status: "error",
      duration: 4000,
      isClosable: false,
    });
    return;
  }

  const password = formData.password;
  const isLongEnough = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);

  if (!isLongEnough || !hasUppercase) {
    toast({
      title: "Invalid password",
      description:
        "Password must be at least 8 characters long and contain at least one uppercase letter.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return;
  }

  try {
    await DataAPI.createUser({
      email: formData.email,
      password: formData.password,
      role: formData.role,
      id: 0, // Assuming the backend generates the ID
      DateJoined: new Date().toISOString(), // Use current date
    });

    toast({
      title: "User created",
      description: "User account successfully created.",
      status: "success",
      duration: 3000,
      isClosable: false,
    });

    fetchUsers(); // Refresh user list
    setFormData({ email: "", password: "", role: UserRole.Tutor }); // Clear form
  } catch (err) {
    toast({
      title: "Error",
      description: "Failed to create user.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  }
};


  return (
    <div className="container">
      <Header />
      <main className="main-content">
        <Head>
          <title>Assignment 1</title>
          <meta name="description" content="Assignment 1" />
        </Head>
        <div className="card">
          <h2 className="card-title">Registration Form</h2>
          <form className="form" onSubmit={handleCreateUser}>
            <div className="form-control">
              <FormControl isRequired>
                <FormLabel color="white">Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email"
                  bg="white"
                  color="black"
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="white">Password</FormLabel>
                <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Password"
                  bg="white"
                  color="black"
                  _placeholder={{ color: "gray.400" }}
                />
                <InputRightElement>
                <Tooltip label={showPassword ? "Hide password" : "Show password"} placement="bottom">
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={togglePasswordVisibility}
                    size="sm"
                    variant="ghost"
                  />
                </Tooltip>
                </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="white">Role</FormLabel>
                <Select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as UserRole,
                    })
                  }
                  placeholder="Select role"
                  bg="white"
                  color="black"
                >
                  <option value="Tutor">Tutor</option>
                  <option value="Lecturer">Lecturer</option>
                </Select>
              </FormControl>

              <Button type="submit" colorScheme="blue" mt={4}>
                Submit
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
