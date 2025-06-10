import "reflect-metadata";
import { DataSource } from "typeorm";

import { User } from "./entity/User";
import { Course } from "./entity/Course";
import { Application } from "./entity/Application";

// data source configuration for connecting to the MySQL database
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "209.38.26.237",
    port: 3306,
    username: "S3934367",
    password: "RidgyMinnu1928!",
    database: "S3934367",
    synchronize: true,
    logging: true,
    entities: [User, Course, Application],
    migrations: [],
    subscribers: [],
})