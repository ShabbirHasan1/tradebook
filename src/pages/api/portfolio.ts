import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Portfolio } from '@/common/types';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;

  const {
    query: { exchange, period, exits },
  } = req;

  const summary = await prisma.$queryRaw<Portfolio[]>(
    `EXEC [dbo].[usp_Portfolio] 
      @period = ${period},
      @exchange = '${exchange}',
      @exits = '${exits}'`,
  );

  res.json(summary);
};
