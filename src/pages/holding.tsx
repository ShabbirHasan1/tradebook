import useSWR from 'swr';
import { Portfolio } from '@/common/types';
import { Stack, Center, Button } from '@chakra-ui/react';
import { Layout } from '@/components/layout';
import { ExchangeButton } from '@/components/exchange-button';
import { useState } from 'react';
import { fetcher, formatPeriod } from '@/common/functions';
import { PositionList } from '@/components/position-list';

export default function Holding() {
  const today = new Date();
  const [exchange, setExchange] = useState(`NSE`);
  const [period, setPeriod] = useState(
    today.getFullYear() * 100 + (today.getMonth() + 1),
  );
  const { data: portfolios } = useSWR<Portfolio[]>(
    `/api/holding?exchange=${exchange}&period=${period}`,
    fetcher,
  );
  return (
    <Layout title={`${formatPeriod(period)}`}>
      <Stack spacing={4}>
        <Center position="relative">
          <ExchangeButton
            exchange={exchange}
            onChange={(ex) => setExchange(ex)}
          />
          <Button
            _hover={{ bg: `blue.600` }}
            _active={{ bg: `blue.600` }}
            position="absolute"
            right="0"
            color="white"
            bg="blue.400"
          >
            Import
          </Button>
        </Center>
        <PositionList
          title={`Holding (${portfolios?.length})`}
          portfolios={portfolios}
        />
      </Stack>
    </Layout>
  );
}
