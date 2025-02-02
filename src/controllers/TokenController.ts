import type { FastifyReply, FastifyRequest } from 'fastify';
import type { UserToken } from '../types/types';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class Token {
	async create(
		request: FastifyRequest<{ Body: UserToken }>,
		reply: FastifyReply,
	): Promise<void> {
		const user = request.body;

		if (!user || !user.email || !user.password) {
			return reply.status(400).send({ errors: ['Credenciais não enviadas'] });
		}

		try {
			const userExists = await prisma.user.findUnique({
				where: { email: user.email },
			});

			if (!userExists)
				return reply.status(401).send({ errors: ['Usuário não existe'] });

			const passwordIsValid = await bcrypt.compare(
				user.password,
				userExists.password,
			);

			if (!passwordIsValid)
				return reply.status(401).send({ errors: ['Senha inválida'] });

			const { password, ...userWithoutPassword } = userExists;

			const token = jwt.sign(
				userWithoutPassword,
				String(process.env.JWT_SECRET),
				{
					expiresIn: '14d',
				},
			);

			return reply.status(201).send({
				user: {
					token,
					id: userExists.id,
					name: userExists.name,
					email: userExists.email,
				},
			});
		} catch (error) {
			return reply
				.status(500)
				.send({ errors: ['Erro interno ao gerar token'] });
		}
	}
}

export default new Token();
