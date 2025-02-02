// src/types/types.ts
import { z } from "zod";
var userBodySchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string()
});
var userTokenSchema = z.object({
  email: z.string(),
  password: z.string()
});
var taskBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  dueDate: z.date()
});
var paramsSchema = z.object({
  id: z.string().uuid()
});
