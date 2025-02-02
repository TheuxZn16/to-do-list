"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/controllers/TaskController.ts
var TaskController_exports = {};
__export(TaskController_exports, {
  default: () => TaskController_default
});
module.exports = __toCommonJS(TaskController_exports);
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var Tasks = class {
  async create(request, reply) {
    console.log("ola");
    const task = request.body;
    if (!task) {
      return reply.status(400).send({ errors: ["Tarefa n\xE3o enviada"] });
    }
    if (!request.user) {
      return reply.status(401).send({ errors: ["Usu\xE1rio n\xE3o logado"] });
    }
    const taskWithUserId = { ...task, userId: request.user.id };
    try {
      const newTask = await prisma.tasks.create({ data: taskWithUserId });
      return reply.status(201).send(newTask);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ errors: ["Erro ao criar a tarefa"] });
    }
  }
  async index(request, reply) {
    try {
      const tasks = await prisma.tasks.findMany({
        where: { userId: request.user?.id }
      });
      return reply.status(200).send(tasks);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ errors: ["Erro ao obter as tarefas"] });
    }
  }
  async show(request, reply) {
    const { id } = request.params;
    try {
      const task = await prisma.tasks.findUnique({
        where: { id }
      });
      if (!task) {
        return reply.status(404).send({ errors: ["Tarefa n\xE3o encontrada"] });
      }
      return reply.status(200).send(task);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ errors: ["Erro ao obter a tarefa"] });
    }
  }
  async update(request, reply) {
    const { id } = request.params;
    const taskData = request.body;
    try {
      const updatedTask = await prisma.tasks.update({
        where: { id },
        data: taskData
      });
      return reply.status(200).send(updatedTask);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ errors: ["Erro ao atualizar a tarefa"] });
    }
  }
  async delete(request, reply) {
    const { id } = request.params;
    try {
      await prisma.tasks.delete({
        where: { id }
      });
      return reply.status(204).send();
    } catch (error) {
      console.error(error);
      return reply.status(500).send();
    }
  }
  async patch(request, reply) {
    const { id } = request.params;
    try {
      const findTask = await prisma.tasks.findUnique({ where: { id } });
      if (!findTask) {
        return reply.status(404).send({ errors: ["Tarefa n\xE3o encontrada"] });
      }
      const task = { ...findTask };
      task.isCompleted = !task.isCompleted;
      const updatedTask = await prisma.tasks.update({
        where: { id },
        data: { isCompleted: task.isCompleted }
      });
      return reply.status(200).send(updatedTask);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ errors: ["Erro ao atualizar a tarefa"] });
    }
  }
};
var TaskController_default = new Tasks();
