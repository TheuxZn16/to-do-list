// src/middlewares/loginRequired.ts
import jwt from "jsonwebtoken";
var loginRequired = async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return reply.status(400).send({ error: ["Token n\xE3o enviado"] });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return reply.status(400).send({ error: ["Token n\xE3o enviado"] });
  }
  try {
    const isTokenValid = jwt.verify(
      token,
      String(process.env.JWT_SECRET)
    );
    if (!isTokenValid) {
      return reply.status(401).send({ error: ["Token inv\xE1lido"] });
    }
    const { id, email, name } = isTokenValid;
    request.user = { id, email, name };
  } catch (error) {
    console.log(error);
    return reply.status(401).send({ error: ["Token inv\xE1lido"] });
  }
};

export {
  loginRequired
};
