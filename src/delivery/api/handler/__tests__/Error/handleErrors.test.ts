import fastify from "fastify";

import { ErrorHandler } from "../../Error";
import errors, { CustomError } from "../../../../../app/errors";

it("should return a generic error", (done) => {
  const router = fastify();
  const log = { error: jest.fn() };

  router.get("/shouldThrow", async (req, res) => {
    throw "unknown error";
  });

  const errorHandler = new ErrorHandler(log);

  router.setErrorHandler(errorHandler.handleErrors);

  router.inject(
    {
      method: "get",
      url: "/shouldThrow",
    },
    (error, response) => {
      expect(response.statusCode).toBe(500);
      expect(response.json()).toStrictEqual({ message: "Request failed" });
      done();
    }
  );
});

it("should return a known error", (done) => {
  // mocks the first error in errors object, couldn't do it using jest's mock methods
  // NOTE: it's important to remember to restore the original value,
  // see the reassignment at the end of this test
  const backupError = errors[0];
  errors[0] = {
    code: "123",
    status: 400,
    message: "error of code 123",
    tag: "some-tag",
  };

  const router = fastify();
  const log = { error: jest.fn() };

  router.get("/shouldThrow", async (req, res) => {
    throw new CustomError({ code: "123" });
  });

  const errorHandler = new ErrorHandler(log);

  router.setErrorHandler(errorHandler.handleErrors);

  router.inject(
    {
      method: "get",
      url: "/shouldThrow",
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      expect(response.json()).toStrictEqual({ message: "error of code 123" });
      expect(log.error).toHaveBeenCalledWith({
        code: "123",
        message: "error of code 123",
        tag: "some-tag",
      });

      // restore the original error
      errors[0] = backupError;

      done();
    }
  );
});

it("should override the status and message of a known error", (done) => {
  // mocks the first error in errors object, couldn't do it using jest's mock methods
  // NOTE: it's important to remember to restore the original value,
  // see the reassignment at the end of this test
  const backupError = errors[0];
  errors[0] = {
    code: "123",
    status: 400,
    message: "error of code 123",
  };

  const router = fastify();
  const log = { error: jest.fn() };

  router.get("/shouldThrow", async (req, res) => {
    throw new CustomError({
      code: "123",
      status: 401,
      message: "message overriding",
      tag: "some-tag",
    });
  });

  const errorHandler = new ErrorHandler(log);

  router.setErrorHandler(errorHandler.handleErrors);

  router.inject(
    {
      method: "get",
      url: "/shouldThrow",
    },
    (error, response) => {
      expect(response.statusCode).toBe(401);
      expect(response.json()).toStrictEqual({ message: "message overriding" });
      expect(log.error).toHaveBeenCalledWith({
        code: "123",
        message: "message overriding",
        tag: "some-tag",
      });

      // restore the original error
      errors[0] = backupError;

      done();
    }
  );
});

it("should return default message and status code", (done) => {
  // mocks the first error in errors object, couldn't do it using jest's mock methods
  // NOTE: it's important to remember to restore the original value,
  // see the reassignment at the end of this test
  const backupError = errors[0];
  errors[0] = {
    code: "123",
    status: 500,
  };

  const router = fastify();
  const log = { error: jest.fn() };

  router.get("/shouldThrow", async (req, res) => {
    throw new CustomError({ code: "123" });
  });

  const errorHandler = new ErrorHandler(log);

  router.setErrorHandler(errorHandler.handleErrors);

  router.inject(
    {
      method: "get",
      url: "/shouldThrow",
    },
    (error, response) => {
      expect(response.statusCode).toBe(500);
      expect(response.json()).toStrictEqual({ message: "Request failed" });
      expect(log.error).toHaveBeenCalledWith({
        code: "123",
        message: "Request failed",
        tag: "credentials-errors",
      });

      // restore the original error
      errors[0] = backupError;

      done();
    }
  );
});
