import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case `POST`: {
      try {
        const { body } = req;
        const { symbol, exchange, type } = JSON.parse(body);
        await await prisma.equity.update({
          where: {
            symbol_exchange: {
              symbol,
              exchange,
            },
          },
          data: { recorded: type === `buy` },
        });
        res
          .status(200)
          .send(`Portfolio ${symbol} in ${exchange} updated to database`);
      } catch (err) {
        res.status(500).send(`Error saving to database`);
      } finally {
        prisma.$disconnect();
      }
      break;
    }
    default: {
      res.status(405).end();
      break;
    }
  }
};
