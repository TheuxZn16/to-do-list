import type { FastifyTypeInstance } from '../types/types';
import { z } from 'zod';
import Token from '../controllers/TokenController';

export default function TokenRoutes(app: FastifyTypeInstance) {
	app.post(
		'/token',
		{
			schema: {
				body: z.object({
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
							token: z.string(),
							id: z.string().uuid(),
							name: z.string(),
							email: z.string(),
						}),
					}),
					400: z.object({ errors: z.array(z.string()) }),
					401: z.object({ errors: z.array(z.string()) }),
					500: z.object({ errors: z.array(z.string()) }),
				},
			},
		},
		Token.create,
	);
}
