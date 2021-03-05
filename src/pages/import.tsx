import {
  Button,
  Heading,
  Text,
  Flex,
  Grid,
  GridItem,
  Input,
  useToast,
  Link,
  Code,
} from '@chakra-ui/react';
import { Layout } from '@/components/layout';
import { useState, useRef, ChangeEvent } from 'react';

export default function Exchange() {
  const [loading, setLoading] = useState(false);
  const hiddenInputTrade = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const onFileClickTrade = () => {
    hiddenInputTrade?.current?.click();
  };
  const onFileSelectTrade = (e: ChangeEvent<HTMLInputElement>) => {
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
      if (hiddenInputTrade && hiddenInputTrade.current) {
        hiddenInputTrade.current.value = ``;
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
  return (
    <Layout title="Import">
      <Grid
        p={8}
        gap={4}
        templateColumns="1fr 1fr"
        templateRows="min-content"
        borderBottom={1}
        borderStyle="solid"
        borderColor="gray.200"
      >
        <GridItem colStart={1} rowStart={1}>
          <Heading fontSize="xl">Trades</Heading>
        </GridItem>
        <GridItem rowStart={2} colStart={1}>
          <Text flexWrap="wrap">
            Import trades csv files directly exported from Zerodha Console.
            Visit{` `}
            <Link
              color="blue.400"
              textDecoration="underline"
              href="https://console.zerodha.com/reports/tradebook"
            >
              Console
            </Link>
            {` `}
            and select the date range you want to download and generate the
            report. A link will appear above the table displayed with CSV
            option. Clicking that button will download a CSV file which can be
            directly imported here. Note that each trade is uniquely identified
            by its <Code>trade_id</Code> and <Code>order_id</Code> and importing
            an existing trade that matches these ids will be skipped.
          </Text>
        </GridItem>
        <GridItem rowStart={2} colStart={2}>
          <Flex justifyContent="flex-end">
            <Input
              id="inputTrades"
              ref={hiddenInputTrade}
              type="file"
              hidden
              onChange={onFileSelectTrade}
            />
            <Button
              onClick={onFileClickTrade}
              isLoading={loading}
              size="lg"
              _hover={{ bg: `blue.600` }}
              _active={{ bg: `blue.600` }}
              color="white"
              bg="blue.400"
            >
              Import
            </Button>
          </Flex>
        </GridItem>
      </Grid>
      <Grid
        p={8}
        gap={4}
        templateColumns="1fr 1fr"
        templateRows="min-content"
        borderBottom={1}
        borderStyle="solid"
        borderColor="gray.200"
      >
        <GridItem colStart={1} rowStart={1}>
          <Heading fontSize="xl">NSE</Heading>
        </GridItem>
        <GridItem rowStart={2} colStart={1}>
          <Text>
            Import securities listed on NSE by visiting this{` `}
            <Link
              color="blue.400"
              textDecoration="underline"
              href="https://www.nseindia.com/market-data/securities-available-for-trading"
            >
              page
            </Link>
            {` `}
            and downloading the{` `}
            <Text as="i">Securities available for Equity segment (.csv)</Text>
            {` `}
            and{` `}
            <Text as="i">Securities available for trading in ETF (.csv)</Text>
            {` `}
            files. These files can then be directly imported here. This master
            data is needed to show the scrip name and ISIN number on the
            Position and Holding pages.
          </Text>
        </GridItem>
        <GridItem rowStart={2} colStart={2}>
          <Flex justifyContent="flex-end">
            <Button
              isLoading={loading}
              size="lg"
              _hover={{ bg: `blue.600` }}
              _active={{ bg: `blue.600` }}
              color="white"
              bg="blue.400"
            >
              Import
            </Button>
          </Flex>
        </GridItem>
      </Grid>
      <Grid p={8} gap={4} templateColumns="1fr 1fr" templateRows="min-content">
        <GridItem colStart={1} rowStart={1}>
          <Heading fontSize="xl">BSE</Heading>
        </GridItem>
        <GridItem rowStart={2} colStart={1}>
          <Text>
            Import securities from BSE by visiting this{` `}
            <Link href="https://www.bseindia.com/corporates/List_Scrips.aspx">
              page
            </Link>
            {` `}
            and selecting <Text as="i">Equity</Text> as Segment and{` `}
            <Text as="i">Active</Text> as status and then click on Submit. Once
            the report is generated a blue download icon appears on the right
            hand side of the screen. Clicking that icon will download the CSV of
            securities which can be directly inmported here. This master data is
            needed to show the scrip name and ISIN number on the Position and
            Holding pages.
          </Text>
        </GridItem>
        <GridItem rowStart={2} colStart={2}>
          <Flex justifyContent="flex-end">
            <Button
              isLoading={loading}
              size="lg"
              _hover={{ bg: `blue.600` }}
              _active={{ bg: `blue.600` }}
              color="white"
              bg="blue.400"
            >
              Import
            </Button>
          </Flex>
        </GridItem>
      </Grid>
    </Layout>
  );
}
