import { Injectable } from '@nestjs/common';

export type StatusResponse = {
  status: 'OK';
  uptime: number;
  env: string;
  timestamp: string;
  version?: string;
};

@Injectable()
export class AppService {
  // Status Check
  getStatus(): StatusResponse {
    return {
      status: 'OK',
      uptime: process.uptime(),
      env: process.env.ENV || 'DEV',
      timestamp: new Date().toISOString(),
    };
  }
}
