import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types/user";
import { Toast, useToast } from "@chakra-ui/react";
import { DataAPI } from "../services/api";
import { useRouter } from "next/router";

// slightly modified AuthContext to include login and logout functionality, by saving session state in a cookie
// also modified to handle user roles and redirect based on role after login, and verifies using a custom made API via DataAPI.getCurrentUser() and 
// DataAPI.signin() and DataAPI.signout() methods. 

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: async () => false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const toast = useToast();
  const router = useRouter();

  // Fetch user on mount to persist login across reloads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await DataAPI.getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await DataAPI.signin(email, password);
      console.log("Login result:", result);
      if (result.success && result.user) {
        setUser(result.user);
        // Set a simple login cookie (expires in 7 days)
        document.cookie = `isLoggedIn=true; path=/; max-age=${60 * 60 * 24 * 7}`;
        console.log("Cookie after login:", document.cookie);
        // Redirect based on user role
        if (result.user.role === "Tutor") {
          router.push("/home");
        } else if (result.user.role === "Lecturer") {
          router.push("/Lecturer");
        } else {
          router.push("/signup");
        }
        return true;

      } else if (result.statusCode === 403) {
        toast({
          title: "Login failed",
          description: "Your account has been blocked by an admin. Please contact them",
          status: "error",
          duration: 5000,
          isClosable: true,
        }); 
        return false;
      } else if (result.statusCode === 401) {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
      // Ensure a boolean is always returned
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setUser(null);
      return false;
    }
  };

  const logout = async () => {
    // Clear user state
    setUser(null);
    // Delete the isLoggedIn cookie by setting its expiry in the past
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    try {
      await DataAPI.signout();
    } catch (error) {
      console.error("Logout error:", error);
      Toast({
        title: "Logout error",
        description: "An unexpected error occurred while logging out",
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
