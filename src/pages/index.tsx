import useSWR from 'swr';
import { ButtonGroup, Button, Center, Stack, useToast } from '@chakra-ui/react';
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
  const [updating, setUpdating] = useState(false);
  const [period, setPeriod] = useState(
    today.getFullYear() * 100 + (today.getMonth() + 1),
  );
  const { data: summary } = useSWR<Summary[]>(
    `/api/summary?exchange=${exchange}&period=${period}`,
    fetcher,
  );
  const { data: portfolios, mutate } = useSWR<Portfolio[]>(
    `/api/position?exchange=${exchange}&period=${period}&exits=${exits}`,
    fetcher,
  );
  const toast = useToast();
  const onRecordClick = async (symbol: string) => {
    setUpdating(true);
    const res = await fetch(`/api/portfolio`, {
      method: `POST`,
      body: JSON.stringify({ symbol, exchange, type: exits ? `sell` : `buy` }),
    });
    const msg = await res.text();
    if (res.status === 200) {
      await mutate();
      toast({
        title: `Portfolio`,
        description: msg,
        status: `success`,
        duration: 5000,
        isClosable: true,
        position: `top`,
      });
    } else {
      toast({
        title: `Portfolio`,
        description: msg,
        status: `error`,
        duration: 5000,
        isClosable: true,
        position: `top`,
      });
    }
    setUpdating(false);
  };
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
  const headerSlot = (
    <ButtonGroup size="sm" isAttached>
      <Button
        mr="-px"
        variant={!exits ? `solid` : `outline`}
        color={!exits ? `white` : `blue.400`}
        onClick={() => setExits(false)}
        bg={!exits ? `blue.400` : `transparent`}
        borderWidth={2}
        borderColor="blue.400"
        _hover={{ bg: !exits ? `blue.400` : `blue.50` }}
        _active={{ bg: !exits ? `blue.400` : `blue.50` }}
      >
        Buy
      </Button>
      <Button
        variant={exits ? `solid` : `outline`}
        color={exits ? `white` : `blue.400`}
        onClick={() => setExits(true)}
        bg={exits ? `blue.400` : `transparent`}
        borderWidth={2}
        borderColor="blue.400"
        _hover={{ bg: exits ? `blue.400` : `blue.50` }}
        _active={{ bg: exits ? `blue.400` : `blue.50` }}
      >
        Sell
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
          recordUpdating={updating}
          exits={exits}
          onRecordClick={onRecordClick}
          isLoading={!portfolios}
          title={`Position (${portfolios ? portfolios?.length : 0})`}
          headerSlot={headerSlot}
          portfolios={portfolios}
        />
      </Stack>
    </Layout>
  );
}
