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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const Course_1 = require("../entity/Course");
const Application_1 = require("../entity/Application");
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
const courseRepository = data_source_1.AppDataSource.getRepository(Course_1.Course);
const applicationRepository = data_source_1.AppDataSource.getRepository(Application_1.Application);
// this file contains the GraphQL resolvers for the application.
exports.resolvers = {
    Query: {
        users: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield userRepository.find();
        }),
        user: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            return yield userRepository.findOne({
                where: { id: parseInt(id) },
            });
        }),
        courses: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield courseRepository.find();
        }),
        course: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            return yield courseRepository.findOne({ where: { courseCode: id } });
        }),
    },
    Mutation: {
        createUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const user = userRepository.create(args);
            return yield userRepository.save(user);
        }),
        updateUser: (_, _a) => __awaiter(void 0, void 0, void 0, function* () {
            var { id } = _a, args = __rest(_a, ["id"]);
            yield userRepository.update(id, args);
            return yield userRepository.findOne({
                where: { id: parseInt(id) },
            });
        }),
        deleteUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            const result = yield userRepository.delete(id);
            return result.affected !== 0;
        }),
        createCourse: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { courseCode, courseName, Lecturer }) {
            const course = courseRepository.create({
                courseCode,
                courseName,
                Lecturer: Lecturer !== null && Lecturer !== void 0 ? Lecturer : "", // Default to empty string if not provided
            });
            return yield courseRepository.save(course);
        }),
        updateCourse: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { oldCourseCode, newCourseCode, courseName }) {
            // If changing the course code, check for conflicts
            if (oldCourseCode !== newCourseCode) {
                const existing = yield courseRepository.findOne({ where: { courseCode: newCourseCode } });
                if (existing)
                    throw new Error("A course with the new course code already exists.");
                // Update the course code and name in one query
                yield courseRepository.update({ courseCode: oldCourseCode }, { courseCode: newCourseCode, courseName });
                // Return the updated course
                return yield courseRepository.findOne({ where: { courseCode: newCourseCode } });
            }
            else {
                // Only update the name
                yield courseRepository.update({ courseCode: oldCourseCode }, { courseName });
                return yield courseRepository.findOne({ where: { courseCode: oldCourseCode } });
            }
        }),
        assignLecturerToCourse: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { courseCode, Lecturer }) {
            const course = yield courseRepository.findOne({ where: { courseCode } });
            if (!course)
                throw new Error("Course not found");
            course.Lecturer = Lecturer;
            return yield courseRepository.save(course);
        }),
        deleteCourse: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { courseCode }) {
            const result = yield courseRepository.delete({ courseCode });
            return result.affected !== 0;
        }),
        addCourseToUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { userId, courseCode }) {
            const user = yield userRepository.findOne({
                where: { id: parseInt(userId) },
                relations: ["courses"],
            });
            const course = yield courseRepository.findOne({
                where: { courseCode },
            });
            if (!user || !course) {
                throw new Error("User or Course not found");
            }
            user.courses = [...(user.courses || []), course];
            return yield userRepository.save(user);
        }),
        removeCourseFromUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { userId, courseCode }) {
            const user = yield userRepository.findOne({
                where: { id: parseInt(userId) },
                relations: ["courses"],
            });
            if (!user) {
                throw new Error("User not found");
            }
            user.courses = (user.courses || []).filter((course) => course.courseCode !== courseCode);
            return yield userRepository.save(user);
        }),
        login: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { email, password }) {
            const user = yield userRepository.findOne({ where: { email } });
            if (!user) {
                return { user: null, token: null, error: "User not found" };
            }
            if (user.password !== password) {
                return { user: null, token: null, error: "Invalid password" };
            }
            const token = Buffer.from(`${user.id}:${user.email}:${user.role}`).toString("base64");
            return { user, token, error: null };
        }),
        blockCandidate: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            const user = yield userRepository.findOne({ where: { id: parseInt(id) } });
            if (!user)
                throw new Error("User not found");
            user.isBlocked = true;
            return yield userRepository.save(user);
        }),
        unblockCandidate: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            const user = yield userRepository.findOne({ where: { id: parseInt(id) } });
            if (!user)
                throw new Error("User not found");
            user.isBlocked = false;
            return yield userRepository.save(user);
        }),
    },
};
//# sourceMappingURL=resolvers.js.map