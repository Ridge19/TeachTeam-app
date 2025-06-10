/// <reference path="../types/express-session.d.ts" />
import { Router } from "express";
import { UserController } from "../controller/UserController";
import session from 'express-session';

const router = Router();
const userController = new UserController();

router.get("/users", async (req, res) => {
  await userController.all(req, res);
});

router.get("/users/:id", async (req, res) => {
  await userController.one(req, res);
});

router.post("/users", async (req, res) => {
  await userController.save(req, res);
});

router.put("/users/:id", async (req, res) => {
  await userController.update(req, res);
});

router.delete("/users/:id", async (req, res) => {
  await userController.remove(req, res);
});

// router.post("/signin", async (req, res) => {
//   await userController.signin(req, res);
// });
router.post("/signin", async (req, res) => {
  // This will set req.session.user in the controller
  await userController.signin(req, res, false); // false = send response, set session
});

router.get("/me", (req, res) => {
  // Use session to get current user
  const sess = req.session as session.Session & { user?: any };
  if (sess && sess.user) {
    res.json(sess.user);
  } else {
    res.status(401).json({ error: "Not signed in" });
  }
});

// signout endpoint
// This will destroy the session and remove user data (cookie)
router.post("/signout", (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  } else {
    res.json({ success: true });
  }
});

export default router;
