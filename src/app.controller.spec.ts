import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import type { StatusResponse } from './app.service';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  const mockService = {
    getStatus: jest.fn(
      (): StatusResponse => ({
        status: 'OK',
        uptime: 123.45,
        env: process.env.ENV || 'DEV',
        timestamp: new Date().toISOString(),
      }),
    ),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockService }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return status object', () => {
      const status = appController.getStatus();
      expect(mockService.getStatus).toHaveBeenCalled();
      expect(status.status).toBe('OK');
      expect(status.uptime).toBeGreaterThan(0);
      expect(new Date(status.timestamp).getTime()).toBeLessThanOrEqual(
        Date.now(),
      );
      expect(['DEV', 'STAG', 'PROD']).toContain(status.env);
    });
  });
});
