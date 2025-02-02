import {
  TaskController_default
} from "./chunk-IQJYFE7P.mjs";
import {
  loginRequired
} from "./chunk-RSQU7O5N.mjs";

// src/routes/TaskRoutes.ts
import { z } from "zod";
function TaskRoutes(app) {
  app.post(
    "/tasks",
    {
      preHandler: loginRequired,
      schema: {
        body: z.object({
          title: z.string().min(1, { message: "O t\xEDtulo \xE9 obrigat\xF3rio." }),
          description: z.string(),
          dueDate: z.string()
        }),
        response: {
          201: z.object({
            id: z.string().uuid(),
            title: z.string(),
            description: z.string(),
            dueDate: z.date(),
            userId: z.string().uuid(),
            isCompleted: z.boolean()
          }),
          400: z.object({ errors: z.array(z.string()) }),
          401: z.object({ errors: z.array(z.string()) }),
          500: z.object({ errors: z.array(z.string()) })
        }
      }
    },
    TaskController_default.create
  );
  app.get(
    "/tasks",
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
              isCompleted: z.boolean()
            })
          ),
          500: z.object({ errors: z.array(z.string()) })
        }
      }
    },
    TaskController_default.index
  );
  app.get(
    "/tasks/:id",
    {
      preHandler: loginRequired,
      schema: {
        params: z.object({
          id: z.string().uuid()
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            title: z.string(),
            description: z.string().optional(),
            dueDate: z.date().optional(),
            userId: z.string().uuid(),
            isCompleted: z.boolean()
          }),
          404: z.object({ errors: z.array(z.string()) }),
          500: z.object({ errors: z.array(z.string()) })
        }
      }
    },
    TaskController_default.show
  );
  app.put(
    "/tasks/:id",
    {
      preHandler: loginRequired,
      schema: {
        params: z.object({
          id: z.string().uuid()
        }),
        body: z.object({
          title: z.string().min(1).optional(),
          description: z.string().optional(),
          dueDate: z.string().optional(),
          isCompleted: z.boolean().optional()
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            title: z.string(),
            description: z.string().optional(),
            dueDate: z.date().optional(),
            userId: z.string().uuid(),
            isCompleted: z.boolean()
          }),
          404: z.object({ errors: z.array(z.string()) }),
          500: z.object({ errors: z.array(z.string()) })
        }
      }
    },
    TaskController_default.update
  );
  app.delete(
    "/tasks/:id",
    {
      preHandler: loginRequired,
      schema: {
        params: z.object({
          id: z.string().uuid()
        }),
        response: {
          204: z.object({}),
          404: z.object({ errors: z.array(z.string()) }),
          500: z.object({ errors: z.array(z.string()) })
        }
      }
    },
    TaskController_default.delete
  );
  app.patch(
    "/tasks/:id",
    {
      preHandler: loginRequired,
      schema: {
        params: z.object({
          id: z.string().uuid()
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            title: z.string(),
            description: z.string().optional(),
            dueDate: z.date().optional(),
            userId: z.string().uuid(),
            isCompleted: z.boolean()
          }),
          404: z.object({ errors: z.array(z.string()) }),
          500: z.object({ errors: z.array(z.string()) })
        }
      }
    },
    TaskController_default.patch
  );
}

export {
  TaskRoutes
};
