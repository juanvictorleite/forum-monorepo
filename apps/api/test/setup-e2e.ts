import { config } from 'dotenv';

import { DomainEvents } from '@forum/domain';
import { Redis } from 'ioredis';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { envSchema } from 'src/env/env';
import { PrismaClient } from '../generated/prisma';

config({ path: '.env', override: true, quiet: true });
config({ path: '.env.test', override: true, quiet: true });

const env = envSchema.parse(process.env);

let prisma: PrismaClient;
const redis = new Redis({
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
  db: Number(env.REDIS_DB),
});

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable');
  }

  const url = new URL(env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  prisma = new PrismaClient();

  DomainEvents.shouldRun = false;

  await redis.flushdb();

  execSync('pnpm prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: databaseURL },
    stdio: 'ignore',
  });
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
