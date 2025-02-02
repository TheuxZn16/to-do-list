import {
  TokenController_default
} from "./chunk-6WLVXSUQ.mjs";

// src/routes/TokenRoutes.ts
import { z } from "zod";
function TokenRoutes(app) {
  app.post(
    "/token",
    {
      schema: {
        body: z.object({
          email: z.string().email({
            message: "O e-mail deve ser um endere\xE7o de e-mail v\xE1lido."
          }),
          password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." })
        }),
        response: {
          201: z.object({
            user: z.object({
              token: z.string(),
              id: z.string().uuid(),
              name: z.string(),
              email: z.string()
            })
          }),
          400: z.object({ errors: z.array(z.string()) }),
          401: z.object({ errors: z.array(z.string()) }),
          500: z.object({ errors: z.array(z.string()) })
        }
      }
    },
    TokenController_default.create
  );
}

export {
  TokenRoutes
};
