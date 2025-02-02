import type {
	FastifyBaseLogger,
	FastifyInstance,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerDefault,
} from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export type FastifyTypeInstance = FastifyInstance<
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	FastifyBaseLogger,
	ZodTypeProvider
>;

const userBodySchema = z.object({
	name: z.string(),
	email: z.string(),
	password: z.string(),
});

export type UserBody = z.infer<typeof userBodySchema>;

const userTokenSchema = z.object({
	email: z.string(),
	password: z.string(),
});

export type UserToken = z.infer<typeof userTokenSchema>;

const taskBodySchema = z.object({
	title: z.string(),
	description: z.string(),
	dueDate: z.date(),
});

export type TaskBody = z.infer<typeof taskBodySchema>;

const paramsSchema = z.object({
	id: z.string().uuid(),
});

export type Params = z.infer<typeof paramsSchema>;
