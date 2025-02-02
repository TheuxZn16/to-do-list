import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Params, UserBody } from '../types/types';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class User {
	async create(
		request: FastifyRequest<{ Body: UserBody }>,
		reply: FastifyReply,
	) {
		const user = request.body;
		if (!user)
			return reply.status(404).send({ errors: ['Credenciais não enviadas'] });

		try {
			const newUser = { ...user };
			newUser.password = await bcrypt.hash(
				newUser.password,
				Number(process.env.SALT),
			);
			await prisma.user.create({ data: newUser });
			reply.status(201).send({
				user: {
					name: newUser.name,
					email: newUser.email,
				},
			});
		} catch (error) {
			reply.status(500).send({ errors: ['Erro ao criar usuário'] });
		}
	}

	async delete(
		request: FastifyRequest<{ Params: Params }>,
		reply: FastifyReply,
	) {
		const { id } = request.params;
		if (!id) return reply.status(404).send({ errors: ['ID não enviado'] });
		try {
			const user = await prisma.user.delete({ where: { id } });
			return reply.status(204).send({ user });
		} catch (error) {
			return reply.status(500).send({ errors: ['Erro interno do servidor'] });
		}
	}
}
export default new User();
