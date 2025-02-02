// src/controllers/UserController.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
var prisma = new PrismaClient();
var User = class {
  async create(request, reply) {
    const user = request.body;
    if (!user)
      return reply.status(404).send({ errors: ["Credenciais n\xE3o enviadas"] });
    try {
      const newUser = { ...user };
      newUser.password = await bcrypt.hash(
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

export {
  UserController_default
};
