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

// src/controllers/UserController.ts
var UserController_exports = {};
__export(UserController_exports, {
  default: () => UserController_default
});
module.exports = __toCommonJS(UserController_exports);
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
