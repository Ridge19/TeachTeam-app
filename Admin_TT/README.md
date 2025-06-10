# Admin Dashboard (HD Section)

This project is an **Admin Dashboard** for lecturer and applicant management, built as a separate React (Next.js) frontend and GraphQL backend (Node.js/TypeORM). It is **not linked to the TT website** and is designed to meet the HD requirements for Assignment 2.

## PLEASE SEE MAIN README FILE FOR MORE INFORMATION (eg. references, how to use application, etc)

## Features & Requirements

### Project Structure

- **Separate projects** for admin front (React/Next.js) and admin GraphQL backend (Node/TypeORM).
- **No REST API**: All data fetching is via GraphQL only.
- **Admin login required**: Use credentials `admin@rmit.edu.au` / `admin` to access the dashboard. (this is pre filled for you)

### Admin Functionalities (3 marks)

- Assign lecturers to course(s) for the semester.
- Add/Edit/Delete courses available in a semester.
- Add: Add course via Course Code and Course Name, following the formatting requirements (eg. CourseCode must have COSCxxxx and CourseName must be > 5 characters)
- Edit: Edit the selected Course, change either the Course Name or the Course Code (both need to meet the formatting requirements)
- Delete: Remove a Course from the Records.
- Block/unblock login of a potential candidate.

### Admin Reports (3 marks)

- List of candidates chosen for each course.
- Candidates chosen for more than 3 courses.
- Candidates who have not been chosen for any course.

### Advanced Feature (3 marks, choose one)

- **GraphQL Subscriptions**: Real-time notifications to lecturers when a candidate becomes unavailable for hiring at the start of the semester. The candidate's name will appear greyed out with a warning in the TT frontend. (No marks if GraphQL subscriptions are not used.)

- **OR**

- **6 Contextual Unit Tests**: Add at least 6 meaningful unit tests in the backend (Node/Express). Explain each test with code comments.

## Getting Started

### Backend (GraphQL)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the backend server:

   ```bash
   npm run dev
   ```

### Frontend (Next.js)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the frontend:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the dashboard.
4. Open [http://localhost:3001/graphql](http://localhost:3001/graphql) to view the grpahql dashboard.

## Notes

- All data is fetched from the backend via GraphQL (no REST endpoints).
- The backend uses TypeORM migrations for database schema management.
- Admin login is required for all dashboard features.
- See code comments for test explanations if you choose the unit test option.

---

For more details, see the assignment PDF and code comments.
