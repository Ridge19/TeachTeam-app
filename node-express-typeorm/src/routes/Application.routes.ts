import { Router } from "express";
import { ApplicationController } from "../controller/ApplicationController";

const router = Router();
const applicationController = new ApplicationController();

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

export default router;
