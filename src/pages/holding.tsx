import useSWR from 'swr';
import { Portfolio, Summary } from '@/common/types';
import {
  Stack,
  Center,
  Button,
  Input,
  useToast,
  ButtonGroup,
} from '@chakra-ui/react';
import { Layout } from '@/components/layout';
import { ExchangeButton } from '@/components/exchange-button';
import { ChangeEvent, useState, useRef } from 'react';
import { fetcher, formatPeriod } from '@/common/functions';
import { PortfolioList } from '@/components/portfolio-list';
import { SummaryCard } from '@/components/summary-card';

export default function Holding() {
  const hiddenInput = useRef<HTMLInputElement>(null);
  const today = new Date();
  const [exchange, setExchange] = useState(`NSE`);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
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
  const onFileClick = () => {
    hiddenInput?.current?.click();
  };
  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const f = e.target.files && e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const res = await fetch(`/api/holding`, {
        method: `POST`,
        body: ev.target?.result,
      });
      const msg = await res.text();
      setLoading(false);
      if (hiddenInput && hiddenInput.current) {
        hiddenInput.current.value = ``;
      }
      if (res.status === 200) {
        toast({
          title: `Import`,
          description: msg,
          status: `success`,
          duration: 9000,
          isClosable: true,
          position: `top`,
        });
      } else {
        toast({
          title: `Import`,
          description: msg,
          status: `error`,
          duration: 9000,
          isClosable: true,
          position: `top`,
        });
      }
    };
    if (f) {
      reader.readAsText(f);
    }
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
  return (
    <Layout headerRight={headerRight} title={`${formatPeriod(period)}`}>
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
            onClick={onFileClick}
            isLoading={loading}
          >
            Import
          </Button>
          <Input ref={hiddenInput} type="file" hidden onChange={onFileSelect} />
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
