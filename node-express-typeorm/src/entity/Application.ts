import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";


// creates the Application entity with the specified columns
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
