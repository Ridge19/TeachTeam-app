import axios from "axios";
import { UserRole } from "../types/user";
import { stat } from "fs";

export const api = axios.create({
    baseURL: "http://localhost:3001/api",
    withCredentials: true, // Allow cookies to be sent with requests
});

// Define the User, Course, and Application interfaces

export interface User {
    id: number;
    email: string;
    password: string;
    role: UserRole;
    DateJoined: string; // ISO date string

    // Tutor: Applicant
    // Lecturer: Teacher (can check tutors application)
}

export interface Course {
    courseCode: string;
    courseName: string;
}

export interface Application {
    applicationId: number;
    courseCode: string;
    fullName: string;
    email: string;
    jobTitle: string;
    company: string;
    skills: string[];
    academics: string;
    institution: string;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    isChecked: boolean;
    applicationDate: string; // ISO date string
    availability: string; // "full-time" or "part-time"
}


export const DataAPI = {
    // USERS
    getAllUsers: async() => {
        const response = await api.get("/users");
        return response.data;
    },

    getUserById: async(id: number) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await api.get("/me");
        return response.data;
    },

    createUser: async(user: User) => {
        const response = await api.post("/users", user);
        return response.data;
    },

    updateUser: async(id: number, user: Partial<User>) => {
        const response = await api.put(`/users/${id}`, user);
        return response.data;
    },

    deleteUser: async(id: number) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    // COURSES
    getAllCourses: async(): Promise<Course[]> => {
        const response = await api.get("/courses");
        return response.data;
    },

    getCourseByCode: async(courseCode: string) => {
        const response = await api.get(`/courses/${courseCode}`);
        return response.data;
    },

    getCourseByName: async(courseName: string) => {
        const response = await api.get(`/courses/name/${courseName}`);
        return response.data;
    },

    updateCourse: async(courseCode: string, course: Partial<Course>) => {
        const response = await api.put(`/courses/${courseCode}`, course);
        return response.data;
    },

    deleteCourse: async(courseCode: string) => {
        const response = await api.delete(`/courses/${courseCode}`);
        return response.data;
    },

    // APPLICATIONS 

    getAllApplications: async() => {
        const response = await api.get("/applications");
        return response.data;
    },

  createApplication: async(application: Application) => {
        const response = await api.post("/applications", application);
        return response.data;
    },


    cancelApplication: async(applicationId: number) => {
        const response = await api.delete(`/applications/${applicationId}`);
        return response.data;
    },

    updateApplication: async(applicationId: number, application: Partial<Application>) => {
        const response = await api.put(`/applications/${applicationId}`, application);
        return response.data;
    },

    viewApplication: async(applicationId: number) => {
        const response = await api.get(`/applications/${applicationId}`);
        return response.data;
    },

    // LOGIN 
    signin: async (email: string, password: string) => {
        try {
          const response = await api.post("/signin", { email, password });
      
          // Check response has expected data
          if (response.data && response.data.success) {
            return {
              success: true,
              user: response.data.user,
              statusCode: response.status,
            };
          } else {
            return { success: false };
          }
        } catch (error) {
          console.error("Login failed:", error);
          let statusCode = 500;

          //checking if the error is an Axios error and if it has a response get the status code
          if (axios.isAxiosError(error) && error.response) {
            statusCode = error.response.status;
          }
          return { success: false, statusCode };
        }
      },

    // LOGOUT
    signout: async () => {
        try {
            const response = await api.post("/signout");
            return response.data;
        } catch (error) {
            console.error("Signout failed:", error);
            return false;
        }
    }
};
