// src/controllers/TokenController.ts
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
var prisma = new PrismaClient();
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
      const passwordIsValid = await bcrypt.compare(
        user.password,
        userExists.password
      );
      if (!passwordIsValid)
        return reply.status(401).send({ errors: ["Senha inv\xE1lida"] });
      const { password, ...userWithoutPassword } = userExists;
      const token = jwt.sign(
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

export {
  TokenController_default
};
