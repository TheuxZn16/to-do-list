import {
  UserRoutes
} from "./chunk-D4LUF23Q.mjs";
import {
  TaskRoutes
} from "./chunk-3TW2SMPE.mjs";
import {
  TokenRoutes
} from "./chunk-Y4O45TBE.mjs";

// src/app.ts
import "dotenv/config";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
var app = fastify().withTypeProvider();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyCors, { origin: "*" });
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "backend-basico",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.register(UserRoutes);
app.register(TokenRoutes);
app.register(TaskRoutes);
var app_default = app;

export {
  app_default
};
