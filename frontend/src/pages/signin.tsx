import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

// modified to use an API (DataAPI.login) to handle authentication instead of a local login function, then verifies with AuthContext
// this allows for better security and flexibility in handling user authentication


export default function SignInPage() {
  const toast = useToast();
  const router = useRouter();
  const { login, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(formData.email.trim().toLowerCase(), formData.password);
      if (success) {
        toast({
          title: "Sign in Successful!",
          description: `Signed in!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Redirect is handled by AuthContext
      } // No else or catch needed: AuthContext handles error toasts
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"container"}>
      <Header />
      <Head>
        <title>Sign In</title>
        <meta name="description" content="Sign in to your account" />
      </Head>

      <div className="card">
        <h2 className="card-title">Sign In</h2>
        <form className="form" onSubmit={handleSignIn}>
          <FormControl isRequired>
            <FormLabel color="White">Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })
              }
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })
                }
                bg="white"
                color="black"
                _placeholder={{ color: "gray.400" }}
              />
              <InputRightElement>
                <IconButton
                  variant="link"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={togglePasswordVisibility}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            mt={4}
            colorScheme="blue"
            isLoading={loading}
            type="submit"
          >
            Sign In
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
