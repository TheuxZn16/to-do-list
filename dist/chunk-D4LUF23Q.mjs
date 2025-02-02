import {
  UserController_default
} from "./chunk-KNF7AIAK.mjs";
import {
  loginRequired
} from "./chunk-RSQU7O5N.mjs";

// src/routes/UserRoutes.ts
import { z } from "zod";
function UserRoutes(app) {
  app.post(
    "/users",
    {
      schema: {
        body: z.object({
          name: z.string().min(3, {
            message: "O nome de usu\xE1rio deve ter pelo menos 3 caracteres."
          }).max(20, {
            message: "O nome de usu\xE1rio deve ter no m\xE1ximo 20 caracteres."
          }),
          email: z.string().email({
            message: "O e-mail deve ser um endere\xE7o de e-mail v\xE1lido."
          }),
          password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." })
        }),
        response: {
          201: z.object({
            user: z.object({
              name: z.string(),
              email: z.string()
            })
          }),
          404: z.object({ errors: z.array(z.string()) }),
          500: z.object({ errors: z.array(z.string()) })
        }
      }
    },
    UserController_default.create
  );
  app.delete(
    "/users/:id",
    {
      schema: {
        params: z.object({
          id: z.string().uuid()
        }),
        response: {
          204: z.object({
            user: z.object({
              id: z.string().uuid(),
              name: z.string(),
              email: z.string(),
              password: z.string()
            })
          }),
          404: z.object({ errors: z.array(z.string()) }),
          500: z.object({ errors: z.array(z.string()) })
        }
      },
      preHandler: loginRequired
    },
    UserController_default.delete
  );
}

export {
  UserRoutes
};
