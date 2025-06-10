"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
// GraphQL schema definition using SDL (Schema Definition Language)
// This schema defines the types, queries, and mutations for the application.
// It includes user roles, user management, course management, and application management.
exports.typeDefs = (0, graphql_tag_1.default) `
  enum UserRole {
    Tutor
    Lecturer
    Admin
  }

  type User {
    id: ID!
    email: String!
    password: String!
    role: UserRole!
    DateJoined: String!
    courses: [Course!]
    isBlocked:Boolean!
  }

  type Course {
    courseCode: String!
    courseName: String!
    Lecturer: String!
  }

  type Application {
    applicationId: ID!
    courseCode: String!
    fullName: String!
    email: String!
    jobTitle: String
    company: String
    skills: [String!]
    academics: String
    institution: String
    startDate: String
    endDate: String
    isChecked: Boolean
    applicationDate: String!
    availability: String
  }

  type AuthPayload {
    user: User
    token: String
    error: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    courses: [Course!]!
    course(id: String!): Course
    applications: [Application!]!
    application(id: ID!): Application
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    createUser(email: String!, password: String!, role: UserRole!): User!
    updateUser(id: ID!, email: String, password: String, role: UserRole): User!
    deleteUser(id: ID!): Boolean!

    createCourse(courseCode: String!, courseName: String!, Lecturer: String): Course!
    updateCourse(oldCourseCode: String!, newCourseCode: String!, courseName: String!): Course!
    deleteCourse(courseCode: String!): Boolean!
    assignLecturerToCourse(courseCode: String!, Lecturer: String! ): Course!

    createApplication(
      courseCode: String!
      fullName: String!
      email: String!
      jobTitle: String
      company: String
      skills: [String!]
      academics: String
      institution: String
      startDate: String
      endDate: String
      isChecked: Boolean
      applicationDate: String!
      availability: String
    ): Application!
    updateApplication(
      id: ID!
      courseCode: String
      fullName: String
      email: String
      jobTitle: String
      company: String
      skills: [String!]
      academics: String
      institution: String
      startDate: String
      endDate: String
      isChecked: Boolean
      applicationDate: String
      availability: String
    ): Application!
    deleteApplication(id: ID!): Boolean!

    addCourseToUser(userId: ID!, courseCode: String!): User!
    removeCourseFromUser(userId: ID!, courseCode: String!): User!
    blockCandidate(id: ID!): User!
    unblockCandidate(id: ID!): User!
  }
`;
//# sourceMappingURL=schema.js.map