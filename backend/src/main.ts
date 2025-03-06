import express, { Application } from "express";
import cors from "cors";
import userAuthRoutes from "./components/users/users_auth_routes";
import userRoutes from "./components/users/users_routes";
import { errorHandler } from "./middleware/errors/errorHandler";
import dotenv from "dotenv";
import requestLoggingMiddleware from "./middleware/logger/loggerMiddleware";
import { errorLoggingMiddleware } from "./middleware/logger/errorLogger";
dotenv.config();
class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setConfig();
    this.setRoutes();
    this.app._router.stack.forEach((r) => {
      if (r.route) {
        console.log(`✅ Route Registered: ${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);
      }
    });
    this.app.use(errorLoggingMiddleware);
    this.app.use(errorHandler);
    
  }

  private setConfig(): void {
    this.app.use(express.json());
    this.app.use(requestLoggingMiddleware);
    this.app.use(cors({origin:'*'}));
    
  }

  private setRoutes(): void {
    this.app.use("/api/v1/auth", userAuthRoutes);
    this.app.use("/api/v1/users", userRoutes);
  }
}

// Export an instance of the app, so server.ts can use it
export default new App().app;
