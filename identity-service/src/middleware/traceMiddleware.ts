import {NextFunction, Request, Response} from 'express';

export default function traceMiddleware() {
  return function(
      req: Request,
      res: Response,
      next: NextFunction) {
    let requestId = req.headers['x-request-id'];

    if (!requestId) {
      requestId = Date.now().toString();
    }
    req['requestId'] = requestId;
    res.setHeader('X-Request-Id', requestId);

    next();
  };
}
