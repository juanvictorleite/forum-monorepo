import { config } from 'dotenv';

import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '../generated/prisma';

config({ path: '.env', override: true, quiet: true });
config({ path: '.env.test', override: true, quiet: true });

let prisma: PrismaClient;

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(() => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  prisma = new PrismaClient();

  execSync('pnpm prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: databaseURL },
    stdio: 'ignore',
  });
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
