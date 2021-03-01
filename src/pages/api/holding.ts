import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Portfolio } from '@/common/types';
import parse from 'csv-parse';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case `GET`: {
      const {
        query: { exchange, period },
      } = req;
      const summary = await prisma.$queryRaw<Portfolio[]>(
        `EXEC [dbo].[usp_Holding] 
            @period = ${period},
            @exchange = '${exchange}'`,
      );
      res.status(200).json(summary);
      prisma.$disconnect();
      break;
    }
    case `POST`: {
      try {
        const { body } = req;
        const parser = parse(body, {
          columns: true,
          cast: true,
        });
        const inserts = [];
        // eslint-disable-next-line no-restricted-syntax
        for await (const record of parser) {
          const tbdb = await prisma.tradebook.findUnique({
            where: {
              trade_id_order_id: {
                trade_id: Number(record.trade_id),
                order_id: Number(record.order_id),
              },
            },
          });
          if (!tbdb) {
            inserts.push({
              order_id: Number(record.order_id),
              trade_id: Number(record.trade_id),
              symbol: record.symbol,
              exchange: record.exchange,
              price: Number(record.price),
              quantity: Number(record.quantity),
              order_execution_time: new Date(record.order_execution_time),
              trade_date: new Date(record.trade_date),
              segment: record.segment,
              series: record.series,
              trade_type: record.trade_type,
            });
          }
        }
        const dbres = await prisma.tradebook.createMany({
          data: inserts,
        });
        res.status(200).send(`Saved ${dbres.count} records to database`);
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
