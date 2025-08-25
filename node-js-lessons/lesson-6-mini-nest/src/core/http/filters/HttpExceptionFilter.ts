import { Request, Response } from 'express';

export class HttpExceptionFilter {
  catch(exception: any, req: Request, res: Response) {
    const status = exception.status || 500;

    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message: exception.message || 'Internal server error',
    });
  }
}
