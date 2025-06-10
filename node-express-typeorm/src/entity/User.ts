import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from "typeorm";

export enum UserRole {
    Tutor = "Tutor",
    Lecturer = "Lecturer",
    Admin = "Admin", // for Admin (HD) application
}

// creates the User entity with the specified columns
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
}

