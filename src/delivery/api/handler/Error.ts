import { FastifyRequest, FastifyReply } from "../../../driver/http/fastify";
import errors from "../../../app/errors";

import { init as InitLogger } from "../../../app/logger";

const defaultMessage = "Request failed";

export class ErrorHandler {
  private log;

  constructor(log) {
    this.log = log;
  }

  public handleErrors = (
    error,
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const knownError = error.customError?.code
      ? errors.find(({ code }) => error.customError.code === code)
      : null;

    if (knownError) {
      const appError = error.customError;
      const message = appError.message || knownError.message || defaultMessage;
      const statusCode = appError.status || knownError.status;

      this.log.error({
        message,
        code: appError.code,
        tag: appError.tag || knownError.tag || "credentials-errors",
      });

      return reply.status(statusCode).send({
        message,
      });
    }

    this.log.error({
      message: error.message,
      code: null,
      tag: "credentials-errors",
    });

    return reply.status(500).send({
      message: defaultMessage,
    });
  };
}

export const init = () => {
  const log = InitLogger();

  return new ErrorHandler(log);
};

export default init;
