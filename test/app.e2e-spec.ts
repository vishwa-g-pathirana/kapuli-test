import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import type { StatusResponse } from '../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/status (GET) should return status object', async () => {
    const res = await request(app.getHttpServer()).get('/status').expect(200);
    const status = res.body as StatusResponse;

    expect(status).toBeDefined();
    expect(status.status).toBe('OK');
    expect(status.uptime).toBeGreaterThan(0);
    expect(new Date(status.timestamp).getTime()).toBeLessThanOrEqual(
      Date.now(),
    );
    expect(['DEV', 'STAG', 'PROD']).toContain(status.env);
  });
});
