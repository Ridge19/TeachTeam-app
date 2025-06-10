"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
const cors_1 = __importDefault(require("cors"));
const server_1 = require("@apollo/server");
const schema_1 = require("./graphql/schema");
const resolvers_1 = require("./graphql/resolvers");
const express4_1 = require("@apollo/server/express4");
const User_1 = require("./entity/User");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const apolloServer = new server_1.ApolloServer({
            typeDefs: schema_1.typeDefs,
            resolvers: resolvers_1.resolvers,
        });
        yield apolloServer.start();
        app.use("/graphql", (0, express4_1.expressMiddleware)(apolloServer));
        yield data_source_1.AppDataSource.initialize();
        console.log("Data Source has been initialized!");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
        });
    });
}
data_source_1.AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const admin = yield userRepo.findOne({ where: { email: "admin@rmit.edu.au" } });
    if (!admin) {
        const newAdmin = userRepo.create({
            email: "admin@rmit.edu.au",
            password: "admin",
            role: User_1.UserRole.Admin,
        });
        yield userRepo.save(newAdmin);
        console.log("Admin user created: admin@rmit.edu.au / admin");
    }
}));
startServer().catch((error) => console.log("Error during server initialization:", error));
//# sourceMappingURL=index.js.map