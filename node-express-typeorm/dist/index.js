"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const Application_routes_1 = __importDefault(require("./routes/Application.routes"));
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
const cors = require("cors");
const PORT = process.env.PORT || 3001;
console.log("Server is starting...");
// ✅ Only this one CORS call
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: "your-secret-key", // use a strong secret in production!
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true if using HTTPS
        httpOnly: true,
        sameSite: "lax"
    }
}));
app.use("/api", user_routes_1.default);
app.use('/api', course_routes_1.default);
app.use('/api', Application_routes_1.default);
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => console.log("Error during Data Source initialization:", error));
//# sourceMappingURL=index.js.map