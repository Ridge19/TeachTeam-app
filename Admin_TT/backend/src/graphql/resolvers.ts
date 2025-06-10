import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Course } from "../entity/Course";
import { Application } from "../entity/Application";

const userRepository = AppDataSource.getRepository(User);
const courseRepository = AppDataSource.getRepository(Course);
const applicationRepository = AppDataSource.getRepository(Application);

// this file contains the GraphQL resolvers for the application.

export const resolvers = {
  Query: {
    users: async () => {
      return await userRepository.find();
    },
    user: async (_: any, { id }: { id: string }) => {
      return await userRepository.findOne({
        where: { id: parseInt(id) },
      });
    },
    courses: async () => {
      return await courseRepository.find();
    },
    course: async (_: any, { id }: { id: string }) => {
      return await courseRepository.findOne({ where: { courseCode: id } });
    },
  },
  Mutation: {
    createUser: async (_: any, args: any) => {
      const user = userRepository.create(args);
      return await userRepository.save(user);
    },
    updateUser: async (
      _: any,
      { id, ...args }: { id: string } & Partial<User>
    ) => {
      await userRepository.update(id, args);
      return await userRepository.findOne({
        where: { id: parseInt(id) },
      });
    },
    deleteUser: async (_: any, { id }: { id: string }) => {
      const result = await userRepository.delete(id);
      return result.affected !== 0;
    },
    createCourse: async (
      _: any,
      { courseCode, courseName, Lecturer }: { courseCode: string; courseName: string; Lecturer?: string }
    ) => {
      const course = courseRepository.create({
        courseCode,
        courseName,
        Lecturer: Lecturer ?? "", // Default to empty string if not provided
      });
      return await courseRepository.save(course);
    },
    updateCourse: async (
      _: any,
      { oldCourseCode, newCourseCode, courseName }: { oldCourseCode: string; newCourseCode: string; courseName: string }
    ) => {
      // If changing the course code, check for conflicts
      if (oldCourseCode !== newCourseCode) {
        const existing = await courseRepository.findOne({ where: { courseCode: newCourseCode } });
        if (existing) throw new Error("A course with the new course code already exists.");

        // Update the course code and name in one query
        await courseRepository.update(
          { courseCode: oldCourseCode },
          { courseCode: newCourseCode, courseName }
        );
        // Return the updated course
        return await courseRepository.findOne({ where: { courseCode: newCourseCode } });
      } else {
        // Only update the name
        await courseRepository.update(
          { courseCode: oldCourseCode },
          { courseName }
        );
        return await courseRepository.findOne({ where: { courseCode: oldCourseCode } });
      }
    },
    assignLecturerToCourse: async (
      _: any,
      { courseCode, Lecturer }: { courseCode: string; Lecturer: string }
    ) => {
      const course = await courseRepository.findOne({ where: { courseCode } });
      if (!course) throw new Error("Course not found");
      course.Lecturer = Lecturer;
      return await courseRepository.save(course);
    },
    deleteCourse: async (_: any, { courseCode }: { courseCode: string }) => {
      const result = await courseRepository.delete({ courseCode });
      return result.affected !== 0;
    },
    addCourseToUser: async (
      _: any,
      { userId, courseCode }: { userId: string; courseCode: string }
    ) => {
      const user = await userRepository.findOne({
        where: { id: parseInt(userId) },
        relations: ["courses"],
      });
      const course = await courseRepository.findOne({
        where: { courseCode },
      });

      if (!user || !course) {
        throw new Error("User or Course not found");
      }

      user.courses = [...(user.courses || []), course];
      return await userRepository.save(user);
    },
    removeCourseFromUser: async (
      _: any,
      { userId, courseCode }: { userId: string; courseCode: string }
    ) => {
      const user = await userRepository.findOne({
        where: { id: parseInt(userId) },
        relations: ["courses"],
      });

      if (!user) {
        throw new Error("User not found");
      }

      user.courses = (user.courses || []).filter(
        (course) => course.courseCode !== courseCode
      );
      return await userRepository.save(user);
    },
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        return { user: null, token: null, error: "User not found" };
      }
      if (user.password !== password) {
        return { user: null, token: null, error: "Invalid password" };
      }
      const token = Buffer.from(`${user.id}:${user.email}:${user.role}`).toString("base64");
      return { user, token, error: null };
    },
    blockCandidate: async (_: any, { id }: { id: string }) => {
      const user = await userRepository.findOne({ where: { id: parseInt(id) } });
      if (!user) throw new Error("User not found");
      user.isBlocked = true;
      return await userRepository.save(user);
    },

    unblockCandidate: async (_: any, { id }: { id: string }) => {
      const user = await userRepository.findOne({ where: { id: parseInt(id) } });
      if (!user) throw new Error("User not found");
      user.isBlocked = false;
      return await userRepository.save(user);
    },
  },
};
