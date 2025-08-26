import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AppLogger } from '../src/logger/logger.service';
import { loggerMock } from './mocks/loggerMock';
import { createProfileDtoValid, createProfileDtoInvalid } from './test-data';

const TEST_API_KEY = 'test';

describe('Profiles E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppLogger)
      .useValue(loggerMock)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  it('POST /profiles succeeds with token', async () => {
    await request(app.getHttpServer())
      .post('/profiles')
      .set('authorization', `Bearer ${TEST_API_KEY}`)
      .send(createProfileDtoValid)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual({
          id: expect.any(String),
          ...createProfileDtoValid,
        });
        expect(loggerMock.log).toHaveBeenCalledWith(
          'profile.created',
          expect.objectContaining({
            id: body.id,
            email: body.email,
          }),
        );
      });
  });

  it('POST /profiles fails without token', () => {
    return request(app.getHttpServer())
      .post('/profiles')
      .send(createProfileDtoValid)
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Missing Authorization header',
        });
      });
  });

  describe('logger', () => {
    it('log validation errors', async () => {
      const emailError = 'email must be an email';

      await request(app.getHttpServer())
        .post('/profiles')
        .set('Authorization', `Bearer ${TEST_API_KEY}`)
        .send(createProfileDtoInvalid)
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual({
            statusCode: 400,
            error: 'Bad Request',
            message: [emailError],
          });
        });

      expect(loggerMock.error).toHaveBeenCalledWith('Validation error', {
        status: 400,
        payload: {
          message: [emailError],
          error: 'Bad Request',
          statusCode: 400,
        },
      });
    });
  });
});
