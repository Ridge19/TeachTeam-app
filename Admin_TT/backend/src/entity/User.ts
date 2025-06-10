import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToMany,
    JoinTable
} from "typeorm";
import { Course } from "./Course";

export enum UserRole {
    Tutor = "Tutor",
    Lecturer = "Lecturer",
    Admin = "Admin"
}

// This entity represents a user in the system.
// It includes fields for the user's email, password, role, date joined, and associated courses.

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: "enum", enum: UserRole })
    role: UserRole;

    @CreateDateColumn()
    DateJoined: Date;

    @Column({ default: false })
    isBlocked: boolean;

    @ManyToMany(() => Course, { eager: true })
    @JoinTable()
    courses: Course[];
}
