import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Account } from '../src/account/entities/account.entity';
import { Movement } from '../src/movements/entities/movements.entity';

describe('Transfer (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let acc1: Account;
  let acc2: Account;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  beforeEach(async () => {
    await dataSource.getRepository(Movement).delete({});
    await dataSource.getRepository(Account).delete({});

    acc1 = await dataSource.getRepository(Account).save({ balance: 100 });
    acc2 = await dataSource.getRepository(Account).save({ balance: 50 });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should transfer successfully', async () => {
    const res = await request(app.getHttpServer())
      .post('/transfer')
      .send({ fromId: acc1.id, toId: acc2.id, amount: 30 });

    expect(res.status).toBe(201);
    expect(res.body.amount).toBe('30');

    const accounts = await dataSource.getRepository(Account).find();
    expect(accounts.find((a) => a.id === acc1.id).balance).toBe('70');
    expect(accounts.find((a) => a.id === acc2.id).balance).toBe('80');
  });

  it('should rollback on insufficient funds', async () => {
    const res = await request(app.getHttpServer())
      .post('/transfer')
      .send({ fromId: acc1.id, toId: acc2.id, amount: 9999 });

    expect(res.status).toBe(400);

    const accounts = await dataSource.getRepository(Account).find();
    expect(accounts.find((a) => a.id === acc1.id).balance).toBe('100');
    expect(accounts.find((a) => a.id === acc2.id).balance).toBe('50');

    const movements = await dataSource.getRepository(Movement).find();
    expect(movements).toHaveLength(0);
  });
});
