class AppError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

class AuthError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

class GeneralServerError extends AppError {
  constructor(message: string = 'Something went wrong.') {
    super(message, 500);
  }
}

class NotExistError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export {
  AuthError,
  AppError,
  BadRequestError,
  GeneralServerError,
  NotExistError,
};
