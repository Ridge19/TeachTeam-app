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
exports.CourseController = void 0;
const Course_1 = require("../entity/Course");
const data_source_1 = require("../data-source");
/**
 * CourseController handles all HTTP requests related to Courses
 * Provides CRUD (Create, Read, Update, Delete) operations for pet resources
 */
class CourseController {
    constructor() {
        /** Repository instance for database operations on Pet entity */
        this.courseRepo = data_source_1.AppDataSource.getRepository(Course_1.Course);
    }
    /**
     * Retrieves all users from the database
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing an array of all users
     */
    all(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield this.courseRepo.find();
            return response.json(courses);
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
            const courseCode = request.params.courseCode;
            const courses = yield this.courseRepo.findOne({
                where: { courseCode },
            });
            if (!courses) {
                return response.status(404).json({ message: "Course not found" });
            }
            return response.json(courses);
        });
    }
}
exports.CourseController = CourseController;
//# sourceMappingURL=CourseController.js.map