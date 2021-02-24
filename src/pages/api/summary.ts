import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;
  const posts = await prisma.tradebook.groupBy({
    by: [`symbol`, `exchange`],
    sum: {
      quantity: true,
    },
  });

  res.json(posts);
};
