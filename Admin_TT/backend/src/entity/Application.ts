import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";


// This entity represents an application for a course.
// It includes fields for the course code, applicant's full name, email, job title,
@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    applicationId: number;

    @Column()
    courseCode: string;

    @Column()
    fullName: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    jobTitle: string;

    @Column({ nullable: true })
    company: string;

    @Column("simple-array", { nullable: true })
    skills: string[];

    @Column({ nullable: true })
    academics: string;

    @Column({ nullable: true })
    institution: string;

    @Column({ nullable: true })
    startDate: string;

    @Column({ nullable: true })
    endDate: string;

    @Column({ default: false })
    isChecked: boolean;

    @Column()
    applicationDate: Date;

    @Column({ nullable: true })
    availability: string;
}
