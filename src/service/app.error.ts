type errorCodes = 'notFound' | 'alreadyTaken';
export class AppError extends Error {
  code: errorCodes;

  constructor(code: errorCodes, message: string){
    super(message);
    this.code = code;
  }
}