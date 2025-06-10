import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user.routes";
import courseRoutes from './routes/course.routes';
import ApplicationRoutes from './routes/Application.routes';
import session from "express-session";

const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3001;

console.log("Server is starting...");

// ✅ Only this one CORS call
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: "your-secret-key", // use a strong secret in production!
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true if using HTTPS
    httpOnly: true,
    sameSite: "lax"
  }
}));

app.use("/api", userRoutes);
app.use('/api', courseRoutes);
app.use('/api', ApplicationRoutes);

// initializing the data source and starting the server
// This will connect to the MySQL database and set up the entities

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );
