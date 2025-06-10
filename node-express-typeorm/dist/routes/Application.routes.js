"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ApplicationController_1 = require("../controller/ApplicationController");
const router = (0, express_1.Router)();
const applicationController = new ApplicationController_1.ApplicationController();
// Get all applications
router.get("/applications", (req, res) => applicationController.all(req, res));
// Get one application by applicationId
router.get("/applications/:id", (req, res) => applicationController.one(req, res));
// Create a new application
router.post("/applications", (req, res) => applicationController.create(req, res));
// Update an application by applicationId
router.put("/applications/:id", (req, res) => applicationController.update(req, res));
// Delete an application by applicationId
router.delete("/applications/:id", (req, res) => applicationController.delete(req, res));
exports.default = router;
//# sourceMappingURL=Application.routes.js.map