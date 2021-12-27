import { FastifyInstance } from "../../driver/http/fastify";

const defineMiddlewares = (router: FastifyInstance) => {
   router.get("/health", function mainHandler(request, reply) {
    reply.header("Content-Type", "application/json; charset=utf-8").send("ok");
  });

};

const defineHandlers = () => {
  // CredentialsHandler();
};

const init = (router) => {
  // Define middlewares & handlers
  defineMiddlewares(router);
  defineHandlers();
};

export default { init };
