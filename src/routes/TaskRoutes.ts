import type { FastifyTypeInstance } from '../types/types';
import Tasks from '../controllers/TaskController';
import { z } from 'zod';
import { loginRequired } from '../middlewares/loginRequired';

export default function TaskRoutes(app: FastifyTypeInstance) {
	app.post(
		'/tasks',
		{
			preHandler: loginRequired,
			schema: {
				body: z.object({
					title: z.string().min(1, { message: 'O título é obrigatório.' }),
					description: z.string(),
					dueDate: z.string(),
				}),
				response: {
					201: z.object({
						id: z.string().uuid(),
						title: z.string(),
						description: z.string(),
						dueDate: z.date(),
						userId: z.string().uuid(),
						isCompleted: z.boolean(),
					}),
					400: z.object({ errors: z.array(z.string()) }),
					401: z.object({ errors: z.array(z.string()) }),
					500: z.object({ errors: z.array(z.string()) }),
				},
			},
		},
		Tasks.create,
	);

	app.get(
		'/tasks',
		{
			preHandler: loginRequired,
			schema: {
				response: {
					200: z.array(
						z.object({
							id: z.string().uuid(),
							title: z.string(),
							description: z.string().optional(),
							dueDate: z.date().optional(),
							userId: z.string().uuid(),
							isCompleted: z.boolean(),
						}),
					),
					500: z.object({ errors: z.array(z.string()) }),
				},
			},
		},
		Tasks.index,
	);

	app.get(
		'/tasks/:id',
		{
			preHandler: loginRequired,
			schema: {
				params: z.object({
					id: z.string().uuid(),
				}),
				response: {
					200: z.object({
						id: z.string().uuid(),
						title: z.string(),
						description: z.string().optional(),
						dueDate: z.date().optional(),
						userId: z.string().uuid(),
						isCompleted: z.boolean(),
					}),
					404: z.object({ errors: z.array(z.string()) }),
					500: z.object({ errors: z.array(z.string()) }),
				},
			},
		},
		Tasks.show,
	);

	app.put(
		'/tasks/:id',
		{
			preHandler: loginRequired,
			schema: {
				params: z.object({
					id: z.string().uuid(),
				}),
				body: z.object({
					title: z.string().min(1).optional(),
					description: z.string().optional(),
					dueDate: z.string().optional(),
					isCompleted: z.boolean().optional(),
				}),
				response: {
					200: z.object({
						id: z.string().uuid(),
						title: z.string(),
						description: z.string().optional(),
						dueDate: z.date().optional(),
						userId: z.string().uuid(),
						isCompleted: z.boolean(),
					}),
					404: z.object({ errors: z.array(z.string()) }),
					500: z.object({ errors: z.array(z.string()) }),
				},
			},
		},
		Tasks.update,
	);

	app.delete(
		'/tasks/:id',
		{
			preHandler: loginRequired,
			schema: {
				params: z.object({
					id: z.string().uuid(),
				}),
				response: {
					204: z.object({}),
					404: z.object({ errors: z.array(z.string()) }),
					500: z.object({ errors: z.array(z.string()) }),
				},
			},
		},
		Tasks.delete,
	);

	app.patch(
		'/tasks/:id',
		{
			preHandler: loginRequired,
			schema: {
				params: z.object({
					id: z.string().uuid(),
				}),
				response: {
					200: z.object({
						id: z.string().uuid(),
						title: z.string(),
						description: z.string().optional(),
						dueDate: z.date().optional(),
						userId: z.string().uuid(),
						isCompleted: z.boolean(),
					}),
					404: z.object({ errors: z.array(z.string()) }),
					500: z.object({ errors: z.array(z.string()) }),
				},
			},
		},
		Tasks.patch,
	);
}
