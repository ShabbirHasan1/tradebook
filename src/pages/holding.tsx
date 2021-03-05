import useSWR from 'swr';
import { Portfolio, Summary } from '@/common/types';
import { Stack, Center, Button, ButtonGroup } from '@chakra-ui/react';
import { Layout } from '@/components/layout';
import { ExchangeButton } from '@/components/exchange-button';
import { useState } from 'react';
import { fetcher, formatPeriod } from '@/common/functions';
import { PortfolioList } from '@/components/portfolio-list';
import { SummaryCard } from '@/components/summary-card';

export default function Holding() {
  const today = new Date();
  const [exchange, setExchange] = useState(`NSE`);
  const [period, setPeriod] = useState(
    today.getFullYear() * 100 + (today.getMonth() + 1),
  );
  const { data: summary } = useSWR<Summary[]>(
    `/api/holding?type=s&exchange=${exchange}&period=${period}`,
    fetcher,
  );
  const { data: portfolios } = useSWR<Portfolio[]>(
    `/api/holding?type=d&exchange=${exchange}&period=${period}`,
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
    <Layout headerRight={headerRight} title={`${formatPeriod(period)}`}>
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
          title={`Holding (${portfolios ? portfolios?.length : 0})`}
          portfolios={portfolios}
        />
      </Stack>
    </Layout>
  );
}
