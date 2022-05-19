import express, { Application, Response } from "express";
import productRouter from "./routes/product.route";
import appEvents from './app-events'

export default async(app: Application) => {
    app.use(express.urlencoded({ extended: true}))
    app.use(express.json());
    appEvents(app)
    app.use('/', productRouter)


    app.use('*', (_req, res: Response) => {
        res.status(404).json({
          success: false,
          message: 'Page not found',
          error: {
            statusCode: 404,
            message: 'You reached a route that is not defined on this server',
          },
        });
      });
 
    return app;
}
