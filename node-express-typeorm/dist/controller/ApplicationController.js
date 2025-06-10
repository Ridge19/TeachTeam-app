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
exports.ApplicationController = void 0;
const Application_1 = require("../entity/Application");
const data_source_1 = require("../data-source");
/**
 * ApplicationController handles all HTTP requests related to Applications
 * Provides CRUD (Create, Read, Update, Delete) operations for application resources
 */
class ApplicationController {
    constructor() {
        /** Repository instance for database operations on Application entity */
        this.applicationRepo = data_source_1.AppDataSource.getRepository(Application_1.Application);
    }
    /**
     * Retrieves all applications from the database
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing an array of all applications
     */
    all(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const applications = yield this.applicationRepo.find();
            return response.json(applications);
        });
    }
    /**
     * Retrieves a single application by its applicationId
     * @param request - Express request object containing the applicationId in params
     * @param response - Express response object
     * @returns JSON response containing the application if found, or 404 error if not found
     */
    one(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const applicationId = request.params.id;
            const application = yield this.applicationRepo.findOne({ where: { applicationId: Number(applicationId) } });
            if (!application) {
                return response.status(404).json({ message: "Application not found" });
            }
            return response.json(application);
        });
    }
    /**
     * Creates a new application
     * @param request - Express request object containing application data in body
     * @param response - Express response object
     * @returns JSON response containing the created application
     */
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = this.applicationRepo.create(request.body);
            const result = yield this.applicationRepo.save(application);
            return response.status(201).json(result);
        });
    }
    /**
     * Updates an existing application by applicationId
     * @param request - Express request object containing applicationId in params and data in body
     * @param response - Express response object
     * @returns JSON response containing the updated application or 404 if not found
     */
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const applicationId = request.params.id;
            let application = yield this.applicationRepo.findOne({ where: { applicationId: Number(applicationId) } });
            if (!application) {
                return response.status(404).json({ message: "Application not found" });
            }
            this.applicationRepo.merge(application, request.body);
            const result = yield this.applicationRepo.save(application);
            return response.json(result);
        });
    }
    /**
     * Deletes an application by applicationId
     * @param request - Express request object containing applicationId in params
     * @param response - Express response object
     * @returns JSON response with success message or 404 if not found
     */
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const applicationId = request.params.id;
            const result = yield this.applicationRepo.delete(Number(applicationId));
            if (result.affected === 0) {
                return response.status(404).json({ message: "Application not found" });
            }
            return response.json({ message: "Application deleted" });
        });
    }
}
exports.ApplicationController = ApplicationController;
//# sourceMappingURL=ApplicationController.js.map