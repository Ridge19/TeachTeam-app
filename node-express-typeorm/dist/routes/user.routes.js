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
/// <reference path="../types/express-session.d.ts" />
const express_1 = require("express");
const UserController_1 = require("../controller/UserController");
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
router.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.all(req, res);
}));
router.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.one(req, res);
}));
router.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.save(req, res);
}));
router.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.update(req, res);
}));
router.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.remove(req, res);
}));
// router.post("/signin", async (req, res) => {
//   await userController.signin(req, res);
// });
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // This will set req.session.user in the controller
    yield userController.signin(req, res, false); // false = send response, set session
}));
router.get("/me", (req, res) => {
    // Use session to get current user
    const sess = req.session;
    if (sess && sess.user) {
        res.json(sess.user);
    }
    else {
        res.status(401).json({ error: "Not signed in" });
    }
});
router.post("/signout", (req, res) => {
    if (req.session) {
        req.session.destroy(() => {
            res.json({ success: true });
        });
    }
    else {
        res.json({ success: true });
    }
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map