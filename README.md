# Full Stack Development Assignment 2  
## RMIT University – 2025 Semester 1

### GitHub Repository  
- Continuation of Assignment 1, now with backend implementation:  
[https://github.com/rmit-fsd-2025-s1/s3934367-s4079204-a2](https://github.com/rmit-fsd-2025-s1/s3934367-s4079204-a2)
- cloned and forked from the original repository: [full stack development assignment 2](https://github.com/rmit-fsd-2025-s1/s3934367-s4079204-a2)
- databse hosted on [PHP MyAdmin - RMIT](https://getmysql.com/phpmyadmin/index.php?route=/&route=%2F)

---

## References Used  
- [READme document formatter](https://readme.so/editor)
- [ChatGPT](https://chatgpt.com) - Used to create this readme file (slightly modified from the first one)
- [signin with graphQL](https://graphql.org/learn/authorization/)
- [authentication with GraphQL](https://www.howtographql.com/graphql-js/6-authentication/)
- [youtube video - React Login with Apollo Server](https://www.youtube.com/watch?v=0Z68AHS011Y&t=3913s)
- [week 10 Lecture Slides](https://rmit.instructure.com/courses/141509/pages/week-10-learning-materials-and-activities?module_item_id=6962933)
- [week 10 Lab materials](https://rmit.instructure.com/courses/141509/pages/week-10-learning-materials-and-activities?module_item_id=6962933)
- [graphQL documentation](https://graphql.org/learn/)
- [real-time dashboards using graphQL](https://dev.to/nowke/building-real-time-dashboard-using-react-graphql-subscriptions-and-redis-pubsub-2gip)
- [graphQL vs REST API](https://www.ibm.com/think/topics/graphql-vs-rest-api)


---

## Distinction Feature  
- **Pie Chart Integration:**  
  We've integrated a dynamic pie chart using this TypeScript example:  
  [StackBlitz TypeScript Pie Chart Example](https://stackblitz.com/edit/typescript-pie-chart?file=pieChart.ts)  
  - for assignment 2, this has been modified to get the applications from the backend, using SelectedCandidates and stores it in LocalStorage
  Please refer to `PieChart.ts` and `applicationStats.tsx`.

---

## Credit Feature  
- **Search and Sort Integration:**  
  We've implemented search and sort functionality according to the Assignment Brief specifications.  
- [How to Sort and Filter Data in React using TypeScript (Note: we did not use the `filterObj` function mentioned in the video)](https://www.youtube.com/watch?v=2iEfZWz1jvs)  
- [React TypeScript: Generic Search and Sort Filters](https://chrisfrew.in/blog/react-typescript-generic-search-sort-and-filters/) 
  - for assignment 2, this has been modified to get the applications from the backend.
  Please refer to `SearchApplicants.tsx`.

---

## Backend & Database Integration

We have integrated a **MySQL** database, hosted via [phpMyAdmin](https://getmysql.com/phpmyadmin/index.php?route=/), to store all core application data. Data is retrieved and persisted using backend API endpoints built with Express and connected via Sequelize ORM.

### Tables Used:
- `users` — Stores account credentials and roles
- `courses` — Contains course information
- `applications` — Stores tutor applications
- `selected_candidates` — For shortlisted applicants (localstorage - selected_candidates gets the application from the database, and the selected applications are saved to localstorage)

> 🔄 **Note**: For this part of the assignment, we removed the `final_selected_candidates` table to avoid confusion between shortlisted and hired candidates. Instead, selected candidates for the pie chart are stored in **localStorage**, and the application data is fetched dynamically using a **custom-made REST API**.

---

## Login System (Cookie-Based Authentication)

We use **cookies** to manage login sessions securely and persistently.
This is due to LocalStorage not working for us. we have decided to use a different approach.
Thanks to Liam for helping us figure this out.

### Login Flow:
- When a user submits login credentials, an API call checks the `users` table in the MySQL database.
- If valid, a cookie is set with `isSignedIn = true` to persist the session.
- If invalid, the backend returns an error, and the cookie is not set.

### Logout Flow:
- On logout, the cookie is deleted, ending the session. (the cookies expiry date is set to 1970, making it invalid.)

This approach avoids exposing credentials on the frontend and improves UX by allowing persistent login states across reloads.

---

## Sample Users

| Role      | Email              | Password        |
|-----------|--------------------|-----------------|
| Lecturer  | Ridge@gmail.com    | Testing12345678 |
| Tutor     | Yuki@gmail.com     | Yuki1234        |

Use these credentials to test login functionality.

feel free to create more users (either Tutor or Lecturer)

---

## Create User

Feel free to create a user as well. we have implemented the sign in page to communicate with the backend database and a custom-made REST API.

You will need to fill out:

| Role      | Email              | Password        |
|-----------|--------------------|-----------------|


then, you can use these credentials to test login functionality.

---

## Data Overview (MySQL)

### Users Table
- Stores user credentials and roles for login authentication.

### Courses Table
- Contains structured course info (e.g., `courseCode`, `courseName`).

### Applications Table
- Holds tutor applications submitted through the form.

### Selected Candidates (Array - LocalStorage)
- Stores shortlisted applicants after review and ranking.

---

## Lecturer Hiring Structure (Updated for Backend)

### 1. Application Submission  
Tutor fills out a form → API call made → data stored in `applications` table.

### 2. Resume Review  
Lecturer selects a course, reviews applicants, and ranks them.  
Results are saved to the `selected_candidates` table.

### 3. Final Selection  
Instead of using a `selected_candidates` table, which are the **final selections** are stored in **localStorage array** on the frontend.  
This simplifies flow and avoids redundancy/confusion, and prevents confusion in databases.

---

## Pie Chart Stats (LocalStorage + API)

The pie chart dynamically reflects real-time data:

- Total applications per course
- Breakdown: **Selected**, **Pending**, and **Not Selected**

### Data Flow:
1. Application data is fetched from MySQL using a **custom REST API**.
2. When a lecturer confirms a final selection, the candidate is stored in **localStorage**.
3. The pie chart reads from both the API (for applications) and localStorage (for selections) to build a visual report.

Check `applicationStats.tsx` for the implementation.

---

## API
- you can access the API using the endpoint localhost:3001/api

- we have a variety of APIs available:

# courses
get all courses:
http://localhost:3001/api/courses

get course via course id:
http://localhost:3001/api/courses/(courseID)

# applications
get all applications:
http://localhost:3001/api/applications

get applications via application id:
http://localhost:3001/api/applications/(applicationID)

# user
check sign in: 
http://localhost:3001/api/me

get all users:
http://localhost:3001/api/users

## Tips for Testing

- Use sample users listed above.
- Inspect cookies via **Dev Tools → Application → Cookies**.
- View localStorage selections for pie chart under **Local Storage**.
- Monitor live data via browser DevTools network tab or phpMyAdmin directly.

---
