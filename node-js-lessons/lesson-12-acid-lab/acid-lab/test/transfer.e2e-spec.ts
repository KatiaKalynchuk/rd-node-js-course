import * as request from 'supertest';
import { DataSource, IsNull, Not } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Movement } from '../src/entities/movement.entity';
import { Account } from '../src/entities/account.entity';

describe('POST /transfer (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);

    await dataSource.runMigrations();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.getRepository(Movement).delete({ id: Not(IsNull()) });
    await dataSource.getRepository(Account).delete({ id: Not(IsNull()) });
  });

  it('successful case → creates a transfer', async () => {
    const accountRepo = dataSource.getRepository(Account);

    const from = await accountRepo.save({ balance: '100' });
    const to = await accountRepo.save({ balance: '50' });

    const res = await request(app.getHttpServer())
      .post('/transfer')
      .send({
        from_id: from.id,
        to_id: to.id,
        amount: '30',
      })
      .expect(201);

    expect(res.body).toMatchObject({
      fromAccount: { id: from.id },
      toAccount: { id: to.id },
      amount: '30',
    });

    const accounts = await accountRepo.find();
    expect(Number(accounts.find((a) => a.id === from.id)?.balance)).toBe(70);
    expect(Number(accounts.find((a) => a.id === to.id)?.balance)).toBe(80);
  });

  it('negative case → insufficient funds', async () => {
    const accountRepo = dataSource.getRepository(Account);
    const movementRepo = dataSource.getRepository(Movement);

    const from = await accountRepo.save({ balance: '20' });
    const to = await accountRepo.save({ balance: '50' });

    await request(app.getHttpServer())
      .post('/transfer')
      .send({
        from_id: from.id,
        to_id: to.id,
        amount: '100',
      })
      .expect(400);

    const fromAccountAfter = await accountRepo.findOneBy({ id: from.id });
    const toAccountAfter = await accountRepo.findOneBy({ id: to.id });

    expect(fromAccountAfter?.balance).toBe('20.00');
    expect(toAccountAfter?.balance).toBe('50.00');

    const movements = await movementRepo.find();
    expect(movements.length).toBe(0);
  });
});
