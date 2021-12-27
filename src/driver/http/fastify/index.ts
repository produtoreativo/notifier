import fastify, {
  FastifyRequest as OriginalFastifyRequest,
  FastifyReply as OriginalFastifyReply,
  FastifyInstance,
  RouteHandlerMethod,
} from "fastify";


interface FastifyRequest extends OriginalFastifyRequest {
  query: { [key: string]: string };
  params: { [key: string]: string };
}

type FastifyReply = OriginalFastifyReply<any, any, any, any, any>;

export { FastifyRequest, FastifyReply, FastifyInstance, RouteHandlerMethod };

let router: FastifyInstance;

/**
 * Create a new app express and http server
 */
export const create = async () => {
  if (router) {
    throw new Error("http server already created");
  }

  const pinoOptions = {
    level: process.env.LOGGER_LEVEL,
    formatters: {
      level(label, number) {
        return { level: label };
      },
    },
  } as any;

  router = fastify({
    logger: pinoOptions,
   
  });

  await router.register(require("fastify-express"));

  return { router };
};

/**
 * Return a existing app express
 * @returns
 */
export const init = () => {
  if (!router) {
    throw new Error("http server not created");
  }

  return router;
};

/**
 * Return a existing app express and http server
 * @returns
 */
export const initWithServer = () => {
  if (!router) {
    throw new Error("http server not created");
  }

  return { router };
};

export default { create, init, initWithServer };
