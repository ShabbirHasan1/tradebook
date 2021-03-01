import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Summary } from '@/common/types';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { exchange, period },
  } = req;
  const summary = await prisma.$queryRaw<Summary[]>(
    `EXEC [dbo].[usp_Summary] 
      @period = ${period},
      @exchange = '${exchange}'`,
  );
  prisma.$disconnect();
  res.status(200).json(summary);
};
