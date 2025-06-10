"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
class UserController {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    /**
     * Handles user sign-in logic
     * @param request - Express request object containing user credentials in body
     * @param response - Express response object
     * @returns JSON response with success or error message
     */
    signin(request_1, response_1) {
        return __awaiter(this, arguments, void 0, function* (request, response, returnUser = false) {
            const { email, password } = request.body;
            console.log("[UserController] Signin attempt:", email, password);
            if (!email || !password) {
                if (returnUser)
                    return null;
                return response.status(400).json({ message: "Email and password are required" });
            }
            const user = yield this.userRepository.findOne({ where: { email: email.trim().toLowerCase() } });
            console.log("[UserController] User found:", user);
            if (!user) {
                console.log("[UserController] No user found for email:", email.trim().toLowerCase());
            }
            else if (user.password !== password) {
                console.log("[UserController] Password mismatch for user:", user.email);
            }
            if (!user || user.password !== password) {
                if (returnUser)
                    return null;
                return response.status(401).json({ success: false, message: "Invalid email or password" });
            }
            // Prepare user object for session/response
            const userObj = {
                id: user.id,
                email: user.email.trim().toLowerCase(),
                role: user.role,
                DateJoined: user.DateJoined
            };
            // If returnUser is true, just return the user object (for in-memory session)
            if (returnUser) {
                return userObj;
            }
            // Set session user for persistent login
            request.session.user = userObj;
            console.log("[UserController] Login successful, session user set:", userObj);
            return response.status(200).json({
                success: true,
                message: "Login successful",
                user: userObj,
                session: request.session.id,
            });
        });
    }
    /**
     * Retrieves all users from the database
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing an array of all users
     */
    all(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.find();
            return response.json(users);
        });
    }
    /**
     * Retrieves a single user by their ID
     * @param request - Express request object containing the user ID in params
     * @param response - Express response object
     * @returns JSON response containing the user if found, or 404 error if not found
     */
    one(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(request.params.id);
            const user = yield this.userRepository.findOne({
                where: { id },
            });
            if (!user) {
                return response.status(404).json({ message: "User not found" });
            }
            return response.json(user);
        });
    }
    /**
     * Creates a new user in the database
     * @param request - Express request object containing user details in body
     * @param response - Express response object
     * @returns JSON response containing the created user or error message
     */
    save(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email, password, role } = request.body;
            const user = Object.assign(new User_1.User(), {
                id,
                email: email.trim().toLowerCase(),
                password,
                role,
            });
            try {
                const savedUser = yield this.userRepository.save(user);
                return response.status(201).json(savedUser);
            }
            catch (error) {
                return response
                    .status(400)
                    .json({ message: "Error creating user", error });
            }
        });
    }
    /**
     * Deletes a user from the database by their ID
     * @param request - Express request object containing the user ID in params
     * @param response - Express response object
     * @returns JSON response with success message or 404 error if user not found
     */
    remove(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(request.params.id);
            const userToRemove = yield this.userRepository.findOne({
                where: { id },
            });
            if (!userToRemove) {
                return response.status(404).json({ message: "User not found" });
            }
            yield this.userRepository.remove(userToRemove);
            return response.json({ message: "User removed successfully" });
        });
    }
    /**
     * Updates an existing user's information
     * @param request - Express request object containing user ID in params and updated details in body
     * @param response - Express response object
     * @returns JSON response containing the updated user or error message
     */
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(request.params.id);
            const { email, password, role } = request.body;
            let userToUpdate = yield this.userRepository.findOne({
                where: { id },
            });
            if (!userToUpdate) {
                return response.status(404).json({ message: "User not found" });
            }
            userToUpdate = Object.assign(userToUpdate, {
                id,
                email,
                password,
                role,
            });
            try {
                const updatedUser = yield this.userRepository.save(userToUpdate);
                return response.json(updatedUser);
            }
            catch (error) {
                return response
                    .status(400)
                    .json({ message: "Error updating user", error });
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map