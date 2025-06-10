// Application array - tracks applications made by tutor 


// DONT NEED THIS FILE AS WE ARE USING THE BACKEND API TO FETCH APPLICATIONS. IT HAS BEEN COMMENTED OUT.

// DUMMY DATA FOR APPLICATIONS.
// this is a list of applications made by tutors for the courses.
export type application = {
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

export const APPLICATIONS: application[] = [

    // dummy data:
    // {
    //     applicationId: 200,
    //     courseCode: "COSC1010",
    //     fullName: "Applicant One",
    //     email: "applicant1@gmail.com",
    //     jobTitle: "Junior Developer",
    //     company: "Tech Innovations",
    //     skills: ["Python", "Algorithms", "Mathematics"],
    //     academics: "Bachelors in Computer Science",
    //     institution: "XYZ University",
    //     startDate: "2023-07-01",
    //     endDate: "2027-06-30",
    //     isChecked: false,
    //     applicationDate: "2025-04-01",
    //     availability: "full-time"
    // },
    // {
    //     applicationId: 201,
    //     courseCode: "COSC1010",
    //     fullName: "Ridge Tagala",
    //     email: "Ridgy@gmail.com",
    //     jobTitle: "Junior Developer",
    //     company: "Tech Innovations",
    //     skills: ["Python", "Algorithms", "Mathematics"],
    //     academics: "Bachelors in Computer Science",
    //     institution: "RMIT University",
    //     startDate: "2023-07-01",
    //     endDate: "2027-06-30",
    //     isChecked: false,
    //     applicationDate: "2025-04-01",
    //     availability: "full-time"
    // },
    // {
    //     applicationId: 202,
    //     courseCode: "COSC1023",
    //     fullName: "Applicant Two",
    //     email: "applicant2@gmail.com",
    //     jobTitle: "Software Engineer",
    //     company: "Global Solutions",
    //     skills: ["Java", "Data Structures", "Complexity Analysis"],
    //     academics: "Master's in Computer Science",
    //     institution: "ABC University",
    //     startDate: "2021-02-01",
    //     endDate: "2023-12-31",
    //     isChecked: true,
    //     applicationDate: "2025-03-28",
    //     availability: "part-time"
    // },
    // {
    //     applicationId: 203,
    //     courseCode: "COSC2578",
    //     fullName: "Applicant One",
    //     email: "applicant1@gmail.com",
    //     jobTitle: "Junior Developer",
    //     company: "Tech Innovations",
    //     skills: ["HTML", "CSS", "JavaScript"],
    //     academics: "Bachelors in Computer Science",
    //     institution: "XYZ University",
    //     startDate: "2023-07-01",
    //     endDate: "2027-06-30",
    //     isChecked: false,
    //     applicationDate: "2025-03-15",
    //     availability: "full-time"
    // },
    // {
    //     applicationId: 204,
    //     courseCode: "COSC1096",
    //     fullName: "Applicant Two",
    //     email: "applicant2@gmail.com",
    //     jobTitle: "Software Engineer",
    //     company: "Global Solutions",
    //     skills: ["SQL", "Database Design", "Normalization"],
    //     academics: "Master's in Computer Science",
    //     institution: "ABC University",
    //     startDate: "2021-02-01",
    //     endDate: "2023-12-31",
    //     isChecked: true,
    //     applicationDate: "2025-02-20",
    //     availability: "part-time"
    // },
    // {
    //     applicationId: 205,
    //     courseCode: "COSC2307",
    //     fullName: "Applicant One",
    //     email: "applicant1@gmail.com",
    //     jobTitle: "Junior Developer",
    //     company: "Tech Innovations",
    //     skills: ["Java", "OOP", "Agile"],
    //     academics: "Bachelors in Computer Science",
    //     institution: "XYZ University",
    //     startDate: "2023-07-01",
    //     endDate: "2027-06-30",
    //     isChecked: false,
    //     applicationDate: "2025-04-05",
    //     availability: "full-time"
    // },
    // {
    //     applicationId: 206,
    //     courseCode: "COSC2103",
    //     fullName: "Applicant Two",
    //     email: "applicant2@gmail.com",
    //     jobTitle: "Software Engineer",
    //     company: "Global Solutions",
    //     skills: ["HTML", "CSS", "Node.js", "React"],
    //     academics: "Master's in Computer Science",
    //     institution: "ABC University",
    //     startDate: "2021-02-01",
    //     endDate: "2023-12-31",
    //     isChecked: true,
    //     applicationDate: "2025-03-10",
    //     availability: "part-time"
    // },
];
