import useSWR from 'swr';
import { ButtonGroup, Button, Center, Stack } from '@chakra-ui/react';
import { Portfolio, Summary } from '@/common/types';
import { Layout } from '@/components/layout';
import { SummaryCard } from '@/components/summary-card';
import { useState } from 'react';
import { PortfolioList } from '@/components/portfolio-list';
import { formatPeriod, fetcher } from '@/common/functions';
import { ExchangeButton } from '@/components/exchange-button';

export default function Home() {
  const today = new Date();
  const [exchange, setExchange] = useState(`NSE`);
  const [exits, setExits] = useState(false);
  const [period, setPeriod] = useState(
    today.getFullYear() * 100 + (today.getMonth() + 1),
  );
  const { data: summary } = useSWR<Summary[]>(
    `/api/summary?exchange=${exchange}&period=${period}`,
    fetcher,
  );
  const { data: portfolios } = useSWR<Portfolio[]>(
    `/api/position?exchange=${exchange}&period=${period}&exits=${exits}`,
    fetcher,
  );
  const headerRight = (
    <ButtonGroup variant="outline" size="lg" isAttached>
      <Button
        borderColor="blue.400"
        mr="-px"
        onClick={() => {
          const year = Math.floor(period / 100);
          const month = period - year * 100;
          const newPeriod =
            month === 1 ? (year - 1) * 100 + 12 : year * 100 + (month - 1);
          setPeriod(newPeriod);
        }}
      >
        Prev
      </Button>
      <Button
        borderColor="blue.400"
        onClick={() => {
          const year = Math.floor(period / 100);
          const month = period - year * 100;
          const newPeriod =
            month === 12 ? (year + 1) * 100 + 1 : year * 100 + (month + 1);
          setPeriod(newPeriod);
        }}
      >
        Next
      </Button>
    </ButtonGroup>
  );
  return (
    <Layout headerRight={headerRight} title={formatPeriod(period)}>
      <Stack spacing={4}>
        <Center>
          <ExchangeButton
            exchange={exchange}
            onChange={(ex) => setExchange(ex)}
          />
        </Center>
        <SummaryCard summary={summary} />
        <PortfolioList
          isLoading={!portfolios}
          title={`Position (${portfolios ? portfolios?.length : 0})`}
          onExit={(e) => setExits(e.target.checked)}
          portfolios={portfolios}
        />
      </Stack>
    </Layout>
  );
}
