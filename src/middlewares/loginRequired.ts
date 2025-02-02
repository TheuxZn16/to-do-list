import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import type { Params, TaskBody } from '../types/types';

interface UserPayload {
	id: string;
	email: string;
	name: string;
}

declare module 'fastify' {
	interface FastifyRequest {
		user?: UserPayload;
	}
}

export const loginRequired = async (
	request: FastifyRequest<{ Params: Params; Body: TaskBody }>,
	reply: FastifyReply,
) => {
	const authHeader = request.headers.authorization;
	if (!authHeader) {
		return reply.status(400).send({ error: ['Token não enviado'] });
	}

	const token = authHeader.split(' ')[1];

	if (!token) {
		return reply.status(400).send({ error: ['Token não enviado'] });
	}

	try {
		const isTokenValid = jwt.verify(
			token,
			String(process.env.JWT_SECRET),
		) as jwt.JwtPayload;

		if (!isTokenValid) {
			return reply.status(401).send({ error: ['Token inválido'] });
		}

		const { id, email, name } = isTokenValid;

		request.user = { id, email, name };
	} catch (error) {
		console.log(error);
		return reply.status(401).send({ error: ['Token inválido'] });
	}
};
