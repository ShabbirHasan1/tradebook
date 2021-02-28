import useSWR from 'swr';
import { ButtonGroup, Button, Center, Stack } from '@chakra-ui/react';
import { Portfolio, Summary } from '@/common/types';
import { Layout } from '@/components/layout';
import { SummaryCard } from '@/components/summary-card';
import { useState } from 'react';
import { PortfolioList } from '@/components/portfolio-list';

export default function Home() {
  const today = new Date();
  const [exchange, setExchange] = useState(`NSE`);
  const [exits, setExits] = useState(false);
  const [period, setPeriod] = useState(
    today.getFullYear() * 100 + (today.getMonth() + 1),
  );
  const fetcher = (...args: Parameters<typeof fetch>) =>
    fetch(...args).then((response) => response.json());
  const { data: summary } = useSWR<Summary[]>(
    `/api/summary?exchange=${exchange}&period=${period}`,
    fetcher,
  );
  const { data: portfolios } = useSWR<Portfolio[]>(
    `/api/portfolio?exchange=${exchange}&period=${period}&exits=${exits}`,
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
    <Layout headerRight={headerRight} title={period.toString()}>
      <Stack spacing={4}>
        <Center>
          <ButtonGroup size="lg" isAttached>
            <Button
              variant={exchange === `NSE` ? `solid` : `outline`}
              color={exchange === `NSE` ? `white` : `blue.400`}
              onClick={() => setExchange(`NSE`)}
              bg={exchange === `NSE` ? `blue.400` : `transparent`}
              borderWidth={2}
              borderColor="blue.400"
              _hover={{ bg: exchange === `NSE` ? `blue.400` : `blue.50` }}
              _active={{ bg: exchange === `NSE` ? `blue.400` : `blue.50` }}
            >
              NSE
            </Button>
            <Button
              variant={exchange === `BSE` ? `solid` : `outline`}
              color={exchange === `BSE` ? `white` : `blue.400`}
              onClick={() => setExchange(`BSE`)}
              bg={exchange === `BSE` ? `blue.400` : `transparent`}
              borderWidth={2}
              borderColor="blue.400"
              _hover={{ bg: exchange === `BSE` ? `blue.400` : `blue.50` }}
              _active={{ bg: exchange === `BSE` ? `blue.400` : `blue.50` }}
            >
              BSE
            </Button>
          </ButtonGroup>
        </Center>
        <SummaryCard summary={summary} date={today} />
        <PortfolioList
          onExit={(e) => setExits(e.target.checked)}
          portfolios={portfolios}
        />
      </Stack>
    </Layout>
  );
}
