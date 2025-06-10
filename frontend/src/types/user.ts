// This file contains the User type and the DEFAULT_USERS array
// which is used to set default users in local storage if none are found
// and to add a new user to the users array and update local storage
// when a new user is registered


// DONT NEED THIS FILE AS WE ARE USING THE BACKEND API TO FETCH APPLICATIONS. IT HAS BEEN COMMENTED OUT.

// DUMMY DATA FOR USERS. USE ANY OF THESE TO LOGIN.
export enum UserRole {
    Tutor = "Tutor",
    Lecturer = "Lecturer"
}

export type User = {
    id: number;
    email: string;
    password: string;
    role: UserRole;
    DateJoined?: string; // ISO date string, optional for default users

    // Tutor: Applicant
    // Lecturer: Teacher (can check tutors application)
}

export const DEFAULT_USERS: User[] = [
    // {id: 100,  email: "Ridgy@gmail.com", password: "SecurePassword123", role: "Lecturer"},
    // {id: 101, email: "Applicant1@gmail.com", password: "SecurePassword123", role: "Tutor"},
    // {id: 102, email: "Yuki@gmail.com", password: "SecurePassword123", role: "Lecturer"},
    // {id: 103, email: "Applicant2@gmail.com", password: "SecurePassword123", role: "Tutor"},
]

