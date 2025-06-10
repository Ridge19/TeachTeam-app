import {
    Entity,
    PrimaryColumn,
    Column,
} from "typeorm";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";


// This entity represents a course in the system.
// It includes fields for the course code, course name, and lecturer.
@Entity()
export class Course {
    @PrimaryColumn()
    courseCode: string;

    @Column()
    courseName: string;

    @Column({ default: "" })
    Lecturer: string;
}
