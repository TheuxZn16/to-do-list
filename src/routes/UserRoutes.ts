import type { FastifyTypeInstance } from '../types/types';
import User from '../controllers/UserController';
import { z } from 'zod';
import { loginRequired } from '../middlewares/loginRequired';

export default function UserRoutes(app: FastifyTypeInstance) {
	app.post(
		'/users',
		{
			schema: {
				body: z.object({
					name: z
						.string()
						.min(3, {
							message: 'O nome de usuário deve ter pelo menos 3 caracteres.',
						})
						.max(20, {
							message: 'O nome de usuário deve ter no máximo 20 caracteres.',
						}),
					email: z.string().email({
						message: 'O e-mail deve ser um endereço de e-mail válido.',
					}),
					password: z
						.string()
						.min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
				}),
				response: {
					201: z.object({
						user: z.object({
							name: z.string(),
							email: z.string(),
						}),
					}),
					404: z.object({ errors: z.array(z.string()) }),
					500: z.object({ errors: z.array(z.string()) }),
				},
			},
		},
		User.create,
	);

	app.delete(
		'/users/:id',
		{
			schema: {
				params: z.object({
					id: z.string().uuid(),
				}),
				response: {
					204: z.object({
						user: z.object({
							id: z.string().uuid(),
							name: z.string(),
							email: z.string(),
							password: z.string(),
						}),
					}),
					404: z.object({ errors: z.array(z.string()) }),
					500: z.object({ errors: z.array(z.string()) }),
				},
			},
			preHandler: loginRequired,
		},
		User.delete,
	);
}
