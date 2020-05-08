import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user.resolver";
import { AdminResolver } from "./resolvers/admin.resolver";
import { IndexResolver } from "./resolvers/index.resolver";
import { customAuthChecker } from "./middleware/auth-checker";

(async () => {
  const app = express();

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, AdminResolver, IndexResolver],
      authChecker: customAuthChecker
    }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app });

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`Express server started at localhost:${port}`);
  });

})();
