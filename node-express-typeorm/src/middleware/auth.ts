// dont need this file.

// import { Request, Response, NextFunction } from 'express';

// // check if user logged in 
// export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
//   if (req.session && req.session.user) {
//     return next();
//   }
//   return res.status(401).json({ error: 'Not authenticated' });
// };

// // check if user has 'lecturer' role 
// export const isLecturer = (req: Request, res: Response, next: NextFunction) => {
//     console.log("User role (Lecturer check):", req.session?.user?.role);
//     if (req.session?.user && req.session.user.role === 'Lecturer') {
//         return next();
//     }
//     return res.status(403).json({ error: 'Forbidden: Lecturer role required' });
// };

// // check if user has 'tutor' role
// export const isTutor = (req: Request, res: Response, next: NextFunction) => {
//     console.log("User role (Tutor check):", req.session?.user?.role);
//     if (req.session?.user && req.session.user.role === 'Tutor') {
//         return next();
//     }
//     return res.status(403).json({ error: 'Forbidden: Tutor role required' });
// }