import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { expressMiddleware } from "@apollo/server/express4";
import { User, UserRole } from "./entity/User";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  app.use("/graphql", expressMiddleware(apolloServer));

  await AppDataSource.initialize();
  console.log("Data Source has been initialized!");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

AppDataSource.initialize().then(async () => {
  const userRepo = AppDataSource.getRepository(User);
  const admin = await userRepo.findOne({ where: { email: "admin@rmit.edu.au" } });
  if (!admin) {
    const newAdmin = userRepo.create({
      email: "admin@rmit.edu.au",
      password: "admin",
      role: UserRole.Admin,
    });
    await userRepo.save(newAdmin);
    console.log("Admin user created: admin@rmit.edu.au / admin");
  }
});

startServer().catch((error) =>
  console.log("Error during server initialization:", error)
);
