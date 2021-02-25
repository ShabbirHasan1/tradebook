import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Summary } from '@/common/types';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;

  const summary = await prisma.$queryRaw<Summary[]>(
    `SELECT * FROM vw_Summary;`,
  );

  res.json(summary);
};
