import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { UserRole } from "../entity/User";
import session from "express-session";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Handles user sign-in logic
   * @param request - Express request object containing user credentials in body
   * @param response - Express response object
   * @returns JSON response with success or error message
   */
  async signin(request: Request, response: Response, returnUser: boolean = false) {
    const { email, password } = request.body;
    console.log("[UserController] Signin attempt:", email, password);

    if (!email || !password) {
      if (returnUser) return null;
      return response.status(400).json({ message: "Email and password are required" });
    }

    const user = await this.userRepository.findOne({ where: { email: email.trim().toLowerCase() } });
    console.log("[UserController] User found:", user);

    if (!user) {
      console.log("[UserController] No user found for email:", email.trim().toLowerCase());
    } else if (user.password !== password) {
      console.log("[UserController] Password mismatch for user:", user.email);
    }

    if (!user || user.password !== password) {
      if (returnUser) return null;
      return response.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (user.isBlocked) {
      console.log("User is blocked:", user.email);
      if (returnUser) return null;
      return response.status(403).json({ success: false, message: "Your account has been blocked by an admin. Please contact them" });
    }

    // Prepare user object for session/response
    const userObj = {
      id: user.id,
      email: user.email.trim().toLowerCase(),
      role: user.role as UserRole,
      DateJoined: user.DateJoined
    };

    // If returnUser is true, just return the user object (for in-memory session)
    if (returnUser) {
      return userObj;
    }

    // Set session user for persistent login
    (request.session as any).user = userObj;
    console.log("[UserController] Login successful, session user set:", userObj);

    return response.status(200).json({
      success: true,
      message: "Login successful",
      user: userObj,
      session: request.session.id,
    });
  }

  /**
   * Retrieves all users from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all users
   */
  async all(request: Request, response: Response) {
    const users = await this.userRepository.find();
    return response.json(users);
  }

  /**
   * Retrieves a single user by their ID
   * @param request - Express request object containing the user ID in params
   * @param response - Express response object
   * @returns JSON response containing the user if found, or 404 error if not found
   */
  async one(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    return response.json(user);
  }

  /**
   * Creates a new user in the database
   * @param request - Express request object containing user details in body
   * @param response - Express response object
   * @returns JSON response containing the created user or error message
   */
  async save(request: Request, response: Response) {
    const { id, email, password, role } = request.body;

    const user = Object.assign(new User(), {
      id,
      email: email.trim().toLowerCase(),
      password,
      role: role as UserRole,
    });

    try {
      const savedUser = await this.userRepository.save(user);
      return response.status(201).json(savedUser);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error creating user", error });
    }
  }

  /**
   * Deletes a user from the database by their ID
   * @param request - Express request object containing the user ID in params
   * @param response - Express response object
   * @returns JSON response with success message or 404 error if user not found
   */
  async remove(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const userToRemove = await this.userRepository.findOne({
      where: { id },
    });

    if (!userToRemove) {
      return response.status(404).json({ message: "User not found" });
    }

    await this.userRepository.remove(userToRemove);
    return response.json({ message: "User removed successfully" });
  }

  /**
   * Updates an existing user's information
   * @param request - Express request object containing user ID in params and updated details in body
   * @param response - Express response object
   * @returns JSON response containing the updated user or error message
   */
  async update(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const { email, password, role } = request.body;

    let userToUpdate = await this.userRepository.findOne({
      where: { id },
    });

    if (!userToUpdate) {
      return response.status(404).json({ message: "User not found" });
    }

    userToUpdate = Object.assign(userToUpdate, {
      id,
      email,
      password,
      role: role as UserRole,
    });

    try {
      const updatedUser = await this.userRepository.save(userToUpdate);
      return response.json(updatedUser);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error updating user", error });
    }
  }
}
