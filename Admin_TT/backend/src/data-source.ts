import "reflect-metadata";
import { DataSource } from "typeorm";
import { Course } from "./entity/Course";
import { User } from "./entity/User";
import { Application } from "./entity/Application";

export const AppDataSource = new DataSource({
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
  entities: [User, Course, Application],
  migrations: [],
  subscribers: [],
});
