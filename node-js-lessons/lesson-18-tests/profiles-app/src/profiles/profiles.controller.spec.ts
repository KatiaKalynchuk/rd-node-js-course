import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ProfilesModule } from './profiles.module';
import { AuthGuard } from '../guards/auth.guard';
import { AppLogger } from '../logger/logger.service';
import { LoggerModule } from '../logger/logger.module';
import { loggerMock } from '../../test/mocks/loggerMock';
import {
  createProfileDtoValid,
  createProfileDtoInvalid,
} from '../../test/test-data';

describe('ProfilesController (integration)', () => {
  let app: INestApplication;

  const makeRequest = () => request(app.getHttpServer());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProfilesModule, LoggerModule],
    })
      .overrideProvider(AppLogger)
      .useValue(loggerMock)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true }) // пропускаємо авторизацію
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[POST] /profiles', () => {
    it('should return a created profile with valid fields', async () => {
      const res = await makeRequest()
        .post('/profiles')
        .send(createProfileDtoValid)
        .expect(201);

      expect(res.body).toEqual({
        ...createProfileDtoValid,
        id: expect.any(String),
      });
    });

    it('should throw error when email is invalid', async () => {
      const emailError = 'email must be an email';

      await makeRequest()
        .post('/profiles')
        .send(createProfileDtoInvalid)
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual({
            statusCode: 400,
            message: [emailError],
            error: 'Bad Request',
          });
        });
    });
  });
});
