import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLogger } from '../services/logger.service';

@Injectable()
export class ReqRespLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLogger) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const method: string = req.method;
    const originalUrl: string = req.originalUrl;
    const body: unknown = req.body;
    const start = Date.now();

    let responseBody: unknown;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const oldSend = res.send.bind(res);
    res.send = (data?: unknown): Response => {
      responseBody = data;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
      return oldSend(data);
    };

    res.on('finish', () => {
      const duration = Date.now() - start;
      const requestBodyStr = safeSerialize(body);
      const responseBodyStr = safeSerialize(responseBody);

      const summary =
        `Request: ${method} ${originalUrl} | Body: ${requestBodyStr} ` +
        `=> Response: Status: ${res.statusCode} | Duration: ${duration}ms | ResponseBody: ${responseBodyStr}`;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.logger.log(summary);
    });

    next();
  }
}

function safeSerialize(data: unknown): string {
  if (data === null || data === undefined) return '';
  if (typeof data === 'string') return data;
  if (typeof data === 'number' || typeof data === 'boolean') return String(data);

  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(data)) {
    return `[Buffer] ${data.toString('base64')}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (typeof data === 'object' && typeof (data as any).pipe === 'function') {
    return '[Stream]';
  }

  try {
    return JSON.stringify(data);
  } catch {
    if (typeof data === 'object' && 'toString' in data) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return `[${data.constructor.name}] ${String(data)}`;
    }
    return '[Unserializable]';
  }
}
