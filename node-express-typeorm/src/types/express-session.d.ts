import "express-session";
import { User, UserRole } from "../entity/User";


// Extend the express-session module to include user information in the session
declare module "express-session" {
        interface SessionData {
            user?: {
            id: number;
            email: string;
            role: UserRole;
            DateJoined: Date;
        };
    }
}

