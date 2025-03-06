export class CustomError extends Error {
    public statusCode: number;
    public status:string;
    public message:string;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.status = "error"
      this.message = message;
    }
  }
  