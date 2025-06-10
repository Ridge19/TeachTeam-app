import { Request, Response } from "express";
import { Course } from "../entity/Course";
import { AppDataSource } from "../data-source";

/**
 * CourseController handles all HTTP requests related to Courses
 * Provides CRUD (Create, Read, Update, Delete) operations for pet resources
 */
export class CourseController {
  /** Repository instance for database operations on Pet entity */
  private courseRepo = AppDataSource.getRepository(Course);

  /**
   * Retrieves all users from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all users
   */
  async all(request: Request, response: Response) {
    const courses = await this.courseRepo.find();
    return response.json(courses);
  }

  
  /**
   * Retrieves a single user by their ID
   * @param request - Express request object containing the user ID in params
   * @param response - Express response object
   * @returns JSON response containing the user if found, or 404 error if not found
   */
  async one(request: Request, response: Response) {
    const courseCode = request.params.courseCode;
    const courses = await this.courseRepo.findOne({
      where: { courseCode },
    });

    if (!courses) {
      return response.status(404).json({ message: "Course not found" });
    }
    return response.json(courses);
  }
}

