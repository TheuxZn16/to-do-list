"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_config = require("dotenv/config");
var import_cors = __toESM(require("@fastify/cors"));
var import_swagger = __toESM(require("@fastify/swagger"));
var import_swagger_ui = __toESM(require("@fastify/swagger-ui"));
var import_fastify = __toESM(require("fastify"));
var import_fastify_type_provider_zod = require("fastify-type-provider-zod");

// src/controllers/UserController.ts
var import_client = require("@prisma/client");
var import_bcrypt = __toESM(require("bcrypt"));
var prisma = new import_client.PrismaClient();
var User = class {
  async create(request, reply) {
    const user = request.body;
    if (!user)
      return reply.status(404).send({ errors: ["Credenciais n\xE3o enviadas"] });
    try {
      const newUser = { ...user };
      newUser.password = await import_bcrypt.default.hash(
        newUser.password,
        Number(process.env.SALT)
      );
      await prisma.user.create({ data: newUser });
      reply.status(201).send({
        user: {
          name: newUser.name,
          email: newUser.email
        }
      });
    } catch (error) {
      reply.status(500).send({ errors: ["Erro ao criar usu\xE1rio"] });
    }
  }
  async delete(request, reply) {
    const { id } = request.params;
    if (!id) return reply.status(404).send({ errors: ["ID n\xE3o enviado"] });
    try {
      const user = await prisma.user.delete({ where: { id } });
      return reply.status(204).send({ user });
    } catch (error) {
      return reply.status(500).send({ errors: ["Erro interno do servidor"] });
    }
  }
};
var UserController_default = new User();

// src/routes/UserRoutes.ts
var import_zod = require("zod");

// src/middlewares/loginRequired.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var loginRequired = async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return reply.status(400).send({ error: ["Token n\xE3o enviado"] });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return reply.status(400).send({ error: ["Token n\xE3o enviado"] });
  }
  try {
    const isTokenValid = import_jsonwebtoken.default.verify(
      token,
      String(process.env.JWT_SECRET)
    );
    if (!isTokenValid) {
      return reply.status(401).send({ error: ["Token inv\xE1lido"] });
    }
    const { id, email, name } = isTokenValid;
    request.user = { id, email, name };
  } catch (error) {
    console.log(error);
    return reply.status(401).send({ error: ["Token inv\xE1lido"] });
  }
};

// src/routes/UserRoutes.ts
function UserRoutes(app2) {
  app2.post(
    "/users",
    {
      schema: {
        body: import_zod.z.object({
          name: import_zod.z.string().min(3, {
            message: "O nome de usu\xE1rio deve ter pelo menos 3 caracteres."
          }).max(20, {
            message: "O nome de usu\xE1rio deve ter no m\xE1ximo 20 caracteres."
          }),
          email: import_zod.z.string().email({
            message: "O e-mail deve ser um endere\xE7o de e-mail v\xE1lido."
          }),
          password: import_zod.z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." })
        }),
        response: {
          201: import_zod.z.object({
            user: import_zod.z.object({
              name: import_zod.z.string(),
              email: import_zod.z.string()
            })
          }),
          404: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) }),
          500: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) })
        }
      }
    },
    UserController_default.create
  );
  app2.delete(
    "/users/:id",
    {
      schema: {
        params: import_zod.z.object({
          id: import_zod.z.string().uuid()
        }),
        response: {
          204: import_zod.z.object({
            user: import_zod.z.object({
              id: import_zod.z.string().uuid(),
              name: import_zod.z.string(),
              email: import_zod.z.string(),
              password: import_zod.z.string()
            })
          }),
          404: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) }),
          500: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) })
        }
      },
      preHandler: loginRequired
    },
    UserController_default.delete
  );
}

// src/routes/TokenRoutes.ts
var import_zod2 = require("zod");

// src/controllers/TokenController.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var import_client2 = require("@prisma/client");
var import_bcrypt2 = __toESM(require("bcrypt"));
var prisma2 = new import_client2.PrismaClient();
var Token = class {
  async create(request, reply) {
    const user = request.body;
    if (!user || !user.email || !user.password) {
      return reply.status(400).send({ errors: ["Credenciais n\xE3o enviadas"] });
    }
    try {
      const userExists = await prisma2.user.findUnique({
        where: { email: user.email }
      });
      if (!userExists)
        return reply.status(401).send({ errors: ["Usu\xE1rio n\xE3o existe"] });
      const passwordIsValid = await import_bcrypt2.default.compare(
        user.password,
        userExists.password
      );
      if (!passwordIsValid)
        return reply.status(401).send({ errors: ["Senha inv\xE1lida"] });
      const { password, ...userWithoutPassword } = userExists;
      const token = import_jsonwebtoken2.default.sign(
        userWithoutPassword,
        String(process.env.JWT_SECRET),
        {
          expiresIn: "14d"
        }
      );
      return reply.status(201).send({
        user: {
          token,
          id: userExists.id,
          name: userExists.name,
          email: userExists.email
        }
      });
    } catch (error) {
      return reply.status(500).send({ errors: ["Erro interno ao gerar token"] });
    }
  }
};
var TokenController_default = new Token();

// src/routes/TokenRoutes.ts
function TokenRoutes(app2) {
  app2.post(
    "/token",
    {
      schema: {
        body: import_zod2.z.object({
          email: import_zod2.z.string().email({
            message: "O e-mail deve ser um endere\xE7o de e-mail v\xE1lido."
          }),
          password: import_zod2.z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." })
        }),
        response: {
          201: import_zod2.z.object({
            user: import_zod2.z.object({
              token: import_zod2.z.string(),
              id: import_zod2.z.string().uuid(),
              name: import_zod2.z.string(),
              email: import_zod2.z.string()
            })
          }),
          400: import_zod2.z.object({ errors: import_zod2.z.array(import_zod2.z.string()) }),
          401: import_zod2.z.object({ errors: import_zod2.z.array(import_zod2.z.string()) }),
          500: import_zod2.z.object({ errors: import_zod2.z.array(import_zod2.z.string()) })
        }
      }
    },
    TokenController_default.create
  );
}

// src/controllers/TaskController.ts
var import_client3 = require("@prisma/client");
var prisma3 = new import_client3.PrismaClient();
var Tasks = class {
  async create(request, reply) {
    console.log("ola");
    const task = request.body;
    if (!task) {
      return reply.status(400).send({ errors: ["Tarefa n\xE3o enviada"] });
    }
    if (!request.user) {
      return reply.status(401).send({ errors: ["Usu\xE1rio n\xE3o logado"] });
    }
    const taskWithUserId = { ...task, userId: request.user.id };
    try {
      const newTask = await prisma3.tasks.create({ data: taskWithUserId });
      return reply.status(201).send(newTask);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ errors: ["Erro ao criar a tarefa"] });
    }
  }
  async index(request, reply) {
    try {
      const tasks = await prisma3.tasks.findMany({
        where: { userId: request.user?.id }
      });
      return reply.status(200).send(tasks);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ errors: ["Erro ao obter as tarefas"] });
    }
  }
  async show(request, reply) {
    const { id } = request.params;
    try {
      const task = await prisma3.tasks.findUnique({
        where: { id }
      });
      if (!task) {
        return reply.status(404).send({ errors: ["Tarefa n\xE3o encontrada"] });
      }
      return reply.status(200).send(task);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ errors: ["Erro ao obter a tarefa"] });
    }
  }
  async update(request, reply) {
    const { id } = request.params;
    const taskData = request.body;
    try {
      const updatedTask = await prisma3.tasks.update({
        where: { id },
        data: taskData
      });
      return reply.status(200).send(updatedTask);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ errors: ["Erro ao atualizar a tarefa"] });
    }
  }
  async delete(request, reply) {
    const { id } = request.params;
    try {
      await prisma3.tasks.delete({
        where: { id }
      });
      return reply.status(204).send();
    } catch (error) {
      console.error(error);
      return reply.status(500).send();
    }
  }
  async patch(request, reply) {
    const { id } = request.params;
    try {
      const findTask = await prisma3.tasks.findUnique({ where: { id } });
      if (!findTask) {
        return reply.status(404).send({ errors: ["Tarefa n\xE3o encontrada"] });
      }
      const task = { ...findTask };
      task.isCompleted = !task.isCompleted;
      const updatedTask = await prisma3.tasks.update({
        where: { id },
        data: { isCompleted: task.isCompleted }
      });
      return reply.status(200).send(updatedTask);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ errors: ["Erro ao atualizar a tarefa"] });
    }
  }
};
var TaskController_default = new Tasks();

// src/routes/TaskRoutes.ts
var import_zod3 = require("zod");
function TaskRoutes(app2) {
  app2.post(
    "/tasks",
    {
      preHandler: loginRequired,
      schema: {
        body: import_zod3.z.object({
          title: import_zod3.z.string().min(1, { message: "O t\xEDtulo \xE9 obrigat\xF3rio." }),
          description: import_zod3.z.string(),
          dueDate: import_zod3.z.string()
        }),
        response: {
          201: import_zod3.z.object({
            id: import_zod3.z.string().uuid(),
            title: import_zod3.z.string(),
            description: import_zod3.z.string(),
            dueDate: import_zod3.z.date(),
            userId: import_zod3.z.string().uuid(),
            isCompleted: import_zod3.z.boolean()
          }),
          400: import_zod3.z.object({ errors: import_zod3.z.array(import_zod3.z.string()) }),
          401: import_zod3.z.object({ errors: import_zod3.z.array(import_zod3.z.string()) }),
          500: import_zod3.z.object({ errors: import_zod3.z.array(import_zod3.z.string()) })
        }
      }
    },
    TaskController_default.create
  );
  app2.get(
    "/tasks",
    {
      preHandler: loginRequired,
      schema: {
        response: {
          200: import_zod3.z.array(
            import_zod3.z.object({
              id: import_zod3.z.string().uuid(),
              title: import_zod3.z.string(),
              description: import_zod3.z.string().optional(),
              dueDate: import_zod3.z.date().optional(),
              userId: import_zod3.z.string().uuid(),
              isCompleted: import_zod3.z.boolean()
            })
          ),
          500: import_zod3.z.object({ errors: import_zod3.z.array(import_zod3.z.string()) })
        }
      }
    },
    TaskController_default.index
  );
  app2.get(
    "/tasks/:id",
    {
      preHandler: loginRequired,
      schema: {
        params: import_zod3.z.object({
          id: import_zod3.z.string().uuid()
        }),
        response: {
          200: import_zod3.z.object({
            id: import_zod3.z.string().uuid(),
            title: import_zod3.z.string(),
            description: import_zod3.z.string().optional(),
            dueDate: import_zod3.z.date().optional(),
            userId: import_zod3.z.string().uuid(),
            isCompleted: import_zod3.z.boolean()
          }),
          404: import_zod3.z.object({ errors: import_zod3.z.array(import_zod3.z.string()) }),
          500: import_zod3.z.object({ errors: import_zod3.z.array(import_zod3.z.string()) })
        }
      }
    },
    TaskController_default.show
  );
  app2.put(
    "/tasks/:id",
    {
      preHandler: loginRequired,
      schema: {
        params: import_zod3.z.object({
          id: import_zod3.z.string().uuid()
        }),
        body: import_zod3.z.object({
          title: import_zod3.z.string().min(1).optional(),
          description: import_zod3.z.string().optional(),
          dueDate: import_zod3.z.string().optional(),
          isCompleted: import_zod3.z.boolean().optional()
        }),
        response: {
          200: import_zod3.z.object({
            id: import_zod3.z.string().uuid(),
            title: import_zod3.z.string(),
            description: import_zod3.z.string().optional(),
            dueDate: import_zod3.z.date().optional(),
            userId: import_zod3.z.string().uuid(),
            isCompleted: import_zod3.z.boolean()
          }),
          404: import_zod3.z.object({ errors: import_zod3.z.array(import_zod3.z.string()) }),
          500: import_zod3.z.object({ errors: import_zod3.z.array(import_zod3.z.string()) })
        }
      }
    },
    TaskController_default.update
  );
  app2.delete(
    "/tasks/:id",
    {
      preHandler: loginRequired,
      schema: {
        params: import_zod3.z.object({
          id: import_zod3.z.string().uuid()
        }),
        response: {
          204: import_zod3.z.object({}),
          404: import_zod3.z.object({ errors: import_zod3.z.array(import_zod3.z.string()) }),
          500: import_zod3.z.object({ errors: import_zod3.z.array(import_zod3.z.string()) })
        }
      }
    },
    TaskController_default.delete
  );
  app2.patch(
    "/tasks/:id",
    {
      preHandler: loginRequired,
      schema: {
        params: import_zod3.z.object({
          id: import_zod3.z.string().uuid()
        }),
        response: {
          200: import_zod3.z.object({
            id: import_zod3.z.string().uuid(),
            title: import_zod3.z.string(),
            description: import_zod3.z.string().optional(),
            dueDate: import_zod3.z.date().optional(),
            userId: import_zod3.z.string().uuid(),
            isCompleted: import_zod3.z.boolean()
          }),
          404: import_zod3.z.object({ errors: import_zod3.z.array(import_zod3.z.string()) }),
          500: import_zod3.z.object({ errors: import_zod3.z.array(import_zod3.z.string()) })
        }
      }
    },
    TaskController_default.patch
  );
}

// src/app.ts
var app = (0, import_fastify.default)().withTypeProvider();
app.setValidatorCompiler(import_fastify_type_provider_zod.validatorCompiler);
app.setSerializerCompiler(import_fastify_type_provider_zod.serializerCompiler);
app.register(import_cors.default, { origin: "*" });
app.register(import_swagger.default, {
  openapi: {
    info: {
      title: "backend-basico",
      version: "1.0.0"
    }
  },
  transform: import_fastify_type_provider_zod.jsonSchemaTransform
});
app.register(import_swagger_ui.default, {
  routePrefix: "/docs"
});
app.register(UserRoutes);
app.register(TokenRoutes);
app.register(TaskRoutes);
var app_default = app;

// src/server.ts
try {
  app_default.listen({ port: 4e3 });
} catch (error) {
  console.error("Error starting the server:", error);
  process.exit(1);
}
