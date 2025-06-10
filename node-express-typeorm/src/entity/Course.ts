import {
    Entity,
    PrimaryColumn,
    Column,
} from "typeorm";


// creates the Course entity with the specified columns
@Entity()
export class Course {
    @PrimaryColumn()
    courseCode: string;

    @Column()
    courseName: string;

    @Column()
    Lecturer: string; // for Admin application (HD), this is the lecturer's email address
}