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

// src/routes/UserRoutes.ts
var UserRoutes_exports = {};
__export(UserRoutes_exports, {
  default: () => UserRoutes
});
module.exports = __toCommonJS(UserRoutes_exports);

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
function UserRoutes(app) {
  app.post(
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
  app.delete(
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
