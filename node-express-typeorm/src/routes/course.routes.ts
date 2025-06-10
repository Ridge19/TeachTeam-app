import { Router } from "express";
import { CourseController } from "../controller/CourseController";

const router = Router();
const courseController = new CourseController();

// Define routes for course management

// get all courses
router.get("/courses", async (req, res) => {
    await courseController.all(req, res);
  });

  // get course by course code
  router.get("/courses/:courseCode", async (req, res) => {
    await courseController.one(req, res);
  });

  export default router;