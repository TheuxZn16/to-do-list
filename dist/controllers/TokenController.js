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

// src/controllers/TokenController.ts
var TokenController_exports = {};
__export(TokenController_exports, {
  default: () => TokenController_default
});
module.exports = __toCommonJS(TokenController_exports);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_client = require("@prisma/client");
var import_bcrypt = __toESM(require("bcrypt"));
var prisma = new import_client.PrismaClient();
var Token = class {
  async create(request, reply) {
    const user = request.body;
    if (!user || !user.email || !user.password) {
      return reply.status(400).send({ errors: ["Credenciais n\xE3o enviadas"] });
    }
    try {
      const userExists = await prisma.user.findUnique({
        where: { email: user.email }
      });
      if (!userExists)
        return reply.status(401).send({ errors: ["Usu\xE1rio n\xE3o existe"] });
      const passwordIsValid = await import_bcrypt.default.compare(
        user.password,
        userExists.password
      );
      if (!passwordIsValid)
        return reply.status(401).send({ errors: ["Senha inv\xE1lida"] });
      const { password, ...userWithoutPassword } = userExists;
      const token = import_jsonwebtoken.default.sign(
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
