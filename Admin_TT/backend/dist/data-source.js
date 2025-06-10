"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Course_1 = require("./entity/Course");
const User_1 = require("./entity/User");
const Application_1 = require("./entity/Application");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "209.38.26.237",
    port: 3306,
    username: "S3934367",
    password: "RidgyMinnu1928!",
    database: "S3934367",
    // synchronize: true will automatically create database tables based on entity definitions
    // and update them when entity definitions change. This is useful during development
    // but should be disabled in production to prevent accidental data loss.
    synchronize: true,
    logging: true,
    entities: [User_1.User, Course_1.Course, Application_1.Application],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map