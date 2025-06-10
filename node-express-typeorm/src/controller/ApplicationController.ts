import { Request, Response } from "express";
import { Application } from "../entity/Application";
import { AppDataSource } from "../data-source";

/**
 * ApplicationController handles all HTTP requests related to Applications
 * Provides CRUD (Create, Read, Update, Delete) operations for application resources
 */
export class ApplicationController {
  /** Repository instance for database operations on Application entity */
  private applicationRepo = AppDataSource.getRepository(Application);

  /**
   * Retrieves all applications from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all applications
   */
  async all(request: Request, response: Response) {
    const applications = await this.applicationRepo.find();
    return response.json(applications);
  }

  /**
   * Retrieves a single application by its applicationId
   * @param request - Express request object containing the applicationId in params
   * @param response - Express response object
   * @returns JSON response containing the application if found, or 404 error if not found
   */
  async one(request: Request, response: Response) {
    const applicationId = request.params.id;
    const application = await this.applicationRepo.findOne({ where: { applicationId: Number(applicationId) } });
    if (!application) {
      return response.status(404).json({ message: "Application not found" });
    }
    return response.json(application);
  }

  /**
   * Creates a new application
   * @param request - Express request object containing application data in body
   * @param response - Express response object
   * @returns JSON response containing the created application
   */
  async create(request: Request, response: Response) {
    const application = this.applicationRepo.create(request.body);
    const result = await this.applicationRepo.save(application);
    return response.status(201).json(result);
  }

  /**
   * Updates an existing application by applicationId
   * @param request - Express request object containing applicationId in params and data in body
   * @param response - Express response object
   * @returns JSON response containing the updated application or 404 if not found
   */
  async update(request: Request, response: Response) {
    const applicationId = request.params.id;
    let application = await this.applicationRepo.findOne({ where: { applicationId: Number(applicationId) } });
    if (!application) {
      return response.status(404).json({ message: "Application not found" });
    }
    this.applicationRepo.merge(application, request.body);
    const result = await this.applicationRepo.save(application);
    return response.json(result);
  }

  /**
   * Deletes an application by applicationId
   * @param request - Express request object containing applicationId in params
   * @param response - Express response object
   * @returns JSON response with success message or 404 if not found
   */
  async delete(request: Request, response: Response) {
    const applicationId = request.params.id;
    const result = await this.applicationRepo.delete(Number(applicationId));
    if (result.affected === 0) {
      return response.status(404).json({ message: "Application not found" });
    }
    return response.json({ message: "Application deleted" });
  }
}
