import type { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import type { TaskBody } from '../types/types';

const prisma = new PrismaClient();

class Tasks {
	async create(
		request: FastifyRequest<{ Body: TaskBody }>,
		reply: FastifyReply,
	) {
		console.log('ola');
		const task = request.body;
		if (!task) {
			return reply.status(400).send({ errors: ['Tarefa não enviada'] });
		}
		if (!request.user) {
			return reply.status(401).send({ errors: ['Usuário não logado'] });
		}

		const taskWithUserId = { ...task, userId: request.user.id };
		try {
			const newTask = await prisma.tasks.create({ data: taskWithUserId });
			return reply.status(201).send(newTask);
		} catch (error) {
			console.error(error);
			return reply.status(500).send({ errors: ['Erro ao criar a tarefa'] });
		}
	}

	async index(request: FastifyRequest, reply: FastifyReply) {
		try {
			const tasks = await prisma.tasks.findMany({
				where: { userId: request.user?.id },
			});
			return reply.status(200).send(tasks);
		} catch (error) {
			console.error(error);
			return reply.status(500).send({ errors: ['Erro ao obter as tarefas'] });
		}
	}

	async show(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const { id } = request.params;
		try {
			const task = await prisma.tasks.findUnique({
				where: { id },
			});
			if (!task) {
				return reply.status(404).send({ errors: ['Tarefa não encontrada'] });
			}
			return reply.status(200).send(task);
		} catch (error) {
			console.error(error);
			return reply.status(500).send({ errors: ['Erro ao obter a tarefa'] });
		}
	}

	async update(
		request: FastifyRequest<{
			Params: { id: string };
			Body: Partial<TaskBody>;
		}>,
		reply: FastifyReply,
	) {
		const { id } = request.params;
		const taskData = request.body;

		try {
			const updatedTask = await prisma.tasks.update({
				where: { id },
				data: taskData,
			});
			return reply.status(200).send(updatedTask);
		} catch (error) {
			console.error(error);
			return reply.status(500).send({ errors: ['Erro ao atualizar a tarefa'] });
		}
	}

	async delete(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const { id } = request.params;

		try {
			await prisma.tasks.delete({
				where: { id },
			});
			return reply.status(204).send();
		} catch (error) {
			console.error(error);
			return reply.status(500).send();
		}
	}

	async patch(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const { id } = request.params;

		try {
			const findTask = await prisma.tasks.findUnique({ where: { id } });

			if (!findTask) {
				return reply.status(404).send({ errors: ['Tarefa não encontrada'] });
			}

			const task = { ...findTask };

			task.isCompleted = !task.isCompleted;
			const updatedTask = await prisma.tasks.update({
				where: { id },
				data: { isCompleted: task.isCompleted },
			});

			return reply.status(200).send(updatedTask);
		} catch (error) {
			console.error(error);
			return reply.status(500).send({ errors: ['Erro ao atualizar a tarefa'] });
		}
	}
}

export default new Tasks();
