interface IError {
  code: string;
  status: number;
  message?: string;
  tag?: string;
}

const errors: IError[] = [
  {
    code: "404",
    status: 404,
  },
  {
    code: "400",
    status: 400,
    message: "Bad request",
  },
];

export class CustomError extends Error {
  public customError: any;

  constructor(customError, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.customError = customError;
  }
}

export default errors;
