"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/TaskRoutes.ts
var TaskRoutes_exports = {};
__export(TaskRoutes_exports, {
  default: () => TaskRoutes
});
module.exports = __toCommonJS(TaskRoutes_exports);

// src/controllers/TaskController.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
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
      const newTask = await prisma.tasks.create({ data: taskWithUserId });
      return reply.status(201).send(newTask);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ errors: ["Erro ao criar a tarefa"] });
    }
  }
  async index(request, reply) {
    try {
      const tasks = await prisma.tasks.findMany({
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
      const task = await prisma.tasks.findUnique({
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
      const updatedTask = await prisma.tasks.update({
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
      await prisma.tasks.delete({
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
      const findTask = await prisma.tasks.findUnique({ where: { id } });
      if (!findTask) {
        return reply.status(404).send({ errors: ["Tarefa n\xE3o encontrada"] });
      }
      const task = { ...findTask };
      task.isCompleted = !task.isCompleted;
      const updatedTask = await prisma.tasks.update({
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

// src/routes/TaskRoutes.ts
function TaskRoutes(app) {
  app.post(
    "/tasks",
    {
      preHandler: loginRequired,
      schema: {
        body: import_zod.z.object({
          title: import_zod.z.string().min(1, { message: "O t\xEDtulo \xE9 obrigat\xF3rio." }),
          description: import_zod.z.string(),
          dueDate: import_zod.z.string()
        }),
        response: {
          201: import_zod.z.object({
            id: import_zod.z.string().uuid(),
            title: import_zod.z.string(),
            description: import_zod.z.string(),
            dueDate: import_zod.z.date(),
            userId: import_zod.z.string().uuid(),
            isCompleted: import_zod.z.boolean()
          }),
          400: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) }),
          401: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) }),
          500: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) })
        }
      }
    },
    TaskController_default.create
  );
  app.get(
    "/tasks",
    {
      preHandler: loginRequired,
      schema: {
        response: {
          200: import_zod.z.array(
            import_zod.z.object({
              id: import_zod.z.string().uuid(),
              title: import_zod.z.string(),
              description: import_zod.z.string().optional(),
              dueDate: import_zod.z.date().optional(),
              userId: import_zod.z.string().uuid(),
              isCompleted: import_zod.z.boolean()
            })
          ),
          500: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) })
        }
      }
    },
    TaskController_default.index
  );
  app.get(
    "/tasks/:id",
    {
      preHandler: loginRequired,
      schema: {
        params: import_zod.z.object({
          id: import_zod.z.string().uuid()
        }),
        response: {
          200: import_zod.z.object({
            id: import_zod.z.string().uuid(),
            title: import_zod.z.string(),
            description: import_zod.z.string().optional(),
            dueDate: import_zod.z.date().optional(),
            userId: import_zod.z.string().uuid(),
            isCompleted: import_zod.z.boolean()
          }),
          404: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) }),
          500: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) })
        }
      }
    },
    TaskController_default.show
  );
  app.put(
    "/tasks/:id",
    {
      preHandler: loginRequired,
      schema: {
        params: import_zod.z.object({
          id: import_zod.z.string().uuid()
        }),
        body: import_zod.z.object({
          title: import_zod.z.string().min(1).optional(),
          description: import_zod.z.string().optional(),
          dueDate: import_zod.z.string().optional(),
          isCompleted: import_zod.z.boolean().optional()
        }),
        response: {
          200: import_zod.z.object({
            id: import_zod.z.string().uuid(),
            title: import_zod.z.string(),
            description: import_zod.z.string().optional(),
            dueDate: import_zod.z.date().optional(),
            userId: import_zod.z.string().uuid(),
            isCompleted: import_zod.z.boolean()
          }),
          404: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) }),
          500: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) })
        }
      }
    },
    TaskController_default.update
  );
  app.delete(
    "/tasks/:id",
    {
      preHandler: loginRequired,
      schema: {
        params: import_zod.z.object({
          id: import_zod.z.string().uuid()
        }),
        response: {
          204: import_zod.z.object({}),
          404: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) }),
          500: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) })
        }
      }
    },
    TaskController_default.delete
  );
  app.patch(
    "/tasks/:id",
    {
      preHandler: loginRequired,
      schema: {
        params: import_zod.z.object({
          id: import_zod.z.string().uuid()
        }),
        response: {
          200: import_zod.z.object({
            id: import_zod.z.string().uuid(),
            title: import_zod.z.string(),
            description: import_zod.z.string().optional(),
            dueDate: import_zod.z.date().optional(),
            userId: import_zod.z.string().uuid(),
            isCompleted: import_zod.z.boolean()
          }),
          404: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) }),
          500: import_zod.z.object({ errors: import_zod.z.array(import_zod.z.string()) })
        }
      }
    },
    TaskController_default.patch
  );
}
