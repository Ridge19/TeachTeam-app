"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTutor = exports.isLecturer = exports.isAuthenticated = void 0;
// check if user logged in 
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ error: 'Not authenticated' });
};
exports.isAuthenticated = isAuthenticated;
// check if user has 'lecturer' role 
const isLecturer = (req, res, next) => {
    var _a, _b, _c;
    console.log("User role (Lecturer check):", (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.role);
    if (((_c = req.session) === null || _c === void 0 ? void 0 : _c.user) && req.session.user.role === 'Lecturer') {
        return next();
    }
    return res.status(403).json({ error: 'Forbidden: Lecturer role required' });
};
exports.isLecturer = isLecturer;
// check if user has 'tutor' role
const isTutor = (req, res, next) => {
    var _a, _b, _c;
    console.log("User role (Tutor check):", (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.role);
    if (((_c = req.session) === null || _c === void 0 ? void 0 : _c.user) && req.session.user.role === 'Tutor') {
        return next();
    }
    return res.status(403).json({ error: 'Forbidden: Tutor role required' });
};
exports.isTutor = isTutor;
//# sourceMappingURL=auth.js.map