import { Portfolio } from '@/common/types';
import {
  Box,
  Flex,
  Text,
  useColorModeValue as mode,
  Divider,
  Grid,
  GridItem,
  Center,
  Progress,
  Stack,
  Circle,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { CSSProperties } from 'react';
import { FixedSizeGrid } from 'react-window';
import { useMeasure, useScrollbarWidth } from 'react-use';

export type PortfolioListItemProps = {
  portfolio: Portfolio;
  period: number;
  exits?: boolean;
  onRecordClick?: (symbol: string) => void;
  recordUpdating?: boolean;
};

export const PortfolioListItem = ({
  portfolio,
  period,
  exits,
  onRecordClick,
  recordUpdating,
}: PortfolioListItemProps) => {
  const {
    symbol,
    name,
    recorded,
    buy_qty,
    sell_qty,
    avg_buy_price,
    avg_sell_price,
    pnl,
    exit_date,
    entry_date,
    isin_no,
  } = portfolio;
  {
    const toast = useToast();
    const showCopySuccess = () => {
      toast({
        description: `Copied to clipboard`,
        status: `success`,
        duration: 2000,
        isClosable: true,
        position: `top`,
      });
    };
    let showRecord = false;
    let recordedBgColor = `white`;
    const bgColor = `white`;
    let color = `gray.500`;
    let dateFmtExit = ``;
    let dateFmtEntry = ``;
    const today = new Date();
    const currPeriod = today.getFullYear() * 100 + (today.getMonth() + 1);
    if (currPeriod === period) {
      if (exits) {
        if (recorded) {
          showRecord = true;
        }
      } else if (!recorded) {
        showRecord = true;
      }
      recordedBgColor = exits ? `red.50` : `green.50`;
    }
    const fmt = new Intl.NumberFormat(`en-IN`, {
      style: `currency`,
      currency: `INR`,
      notation: `compact`,
    });
    const mo = new Intl.DateTimeFormat(`en-IN`, {
      month: `short`,
      day: `2-digit`,
      year: `numeric`,
    });
    if (pnl > 0) {
      color = `green.400`;
    } else if (pnl < 0) {
      color = `red.400`;
    }
    let exitPeriod = 0;
    let entryPeriod = 0;
    if (exit_date) {
      const dt = new Date(exit_date);
      if (dt.getFullYear() > 1900) {
        exitPeriod = dt.getFullYear() * 100 + (dt.getMonth() + 1);
        dateFmtExit = mo.format(dt);
      }
    }
    if (entry_date) {
      const dt = new Date(entry_date);
      if (dt.getFullYear() > 1900) {
        entryPeriod = dt.getFullYear() * 100 + (dt.getMonth() + 1);
        dateFmtEntry = mo.format(dt);
      }
    }
    if (!exits) {
      if (exitPeriod === entryPeriod) {
        showRecord = false;
      }
    }
    return (
      <Grid
        as="dl"
        gridTemplateColumns="1fr 1fr"
        gridTemplateRows="min-content"
        shadow="md"
        rounded={{ md: `lg` }}
        bg={bgColor}
      >
        <GridItem display="flex" colSpan={2}>
          <Stack
            bg={recordedBgColor}
            align="center"
            borderTopLeftRadius={6}
            borderTop={1}
            borderLeft={1}
            borderRight={1}
            borderStyle="solid"
            borderColor="gray.300"
            p={4}
            w="50%"
          >
            <Text color="green.400" fontWeight="semibold" fontSize="xl">
              {fmt.format(avg_buy_price)}
            </Text>
            <Text color="gray.400" fontWeight="semibold">
              {buy_qty} qty
            </Text>
          </Stack>
          <Stack
            bg={recordedBgColor}
            align="center"
            borderTop={1}
            borderRight={1}
            borderTopRightRadius={6}
            borderStyle="solid"
            borderColor="gray.300"
            p={4}
            w="50%"
          >
            <Text color="red.400" fontWeight="semibold" fontSize="xl">
              {fmt.format(avg_sell_price)}
            </Text>
            <Text color="gray.400" fontWeight="semibold">
              {sell_qty} qty
            </Text>
          </Stack>
        </GridItem>
        <GridItem colSpan={2}>
          <Stack
            spacing={1}
            borderTop={1}
            borderLeft={1}
            borderRight={1}
            borderStyle="solid"
            borderColor="gray.300"
            p={4}
            bg={bgColor}
            mt="-px"
            position="relative"
          >
            <Text
              as="button"
              textAlign="left"
              fontWeight="bold"
              outline="none"
              isTruncated
              cursor="pointer"
              casing="uppercase"
              onClick={() => {
                navigator?.clipboard?.writeText(name);
                showCopySuccess();
              }}
            >
              {name}
            </Text>
            <Flex justify="space-between">
              <Stack flexGrow={1} spacing={2} align="center" direction="row">
                <Text
                  as="button"
                  textAlign="left"
                  cursor="pointer"
                  outline="none"
                  onClick={() => {
                    navigator?.clipboard?.writeText(symbol);
                    showCopySuccess();
                  }}
                  fontSize="sm"
                  color="gray.400"
                  fontWeight="semibold"
                >
                  {symbol}
                </Text>
                <Circle size="6px" bg="gray.300" />
                <Text
                  as="button"
                  textAlign="left"
                  cursor="pointer"
                  outline="none"
                  onClick={() => {
                    navigator?.clipboard?.writeText(isin_no);
                    showCopySuccess();
                  }}
                  fontSize="sm"
                  color="gray.400"
                  fontWeight="semibold"
                  w={16}
                  isTruncated
                >
                  {isin_no}
                </Text>
              </Stack>
              {onRecordClick && showRecord && (
                <IconButton
                  w={4}
                  size="xs"
                  aria-label="Record"
                  onClick={() => onRecordClick(symbol)}
                  isLoading={recordUpdating}
                  // href={`https://www.nseindia.com/get-quotes/equity?symbol=${symbol}`}
                  // isExternal
                  icon={<RepeatIcon />}
                />
              )}
            </Flex>
            <Stack justify="space-between" direction="row">
              <Text fontSize="sm" color="gray.400" fontWeight="semibold">
                {dateFmtEntry}
              </Text>
              <Text fontSize="sm" color="gray.400" fontWeight="semibold">
                {dateFmtExit}
              </Text>
            </Stack>
          </Stack>
        </GridItem>
        <GridItem colSpan={2}>
          <Flex
            spacing="2"
            borderTop={2}
            borderLeft={1}
            borderRight={1}
            justify="space-between"
            borderStyle="solid"
            borderColor="gray.300"
            p={4}
            align="center"
            bg={recordedBgColor}
            mt="-px"
            borderBottomRightRadius={6}
            borderBottomLeftRadius={6}
          >
            <Text color="gray.400" casing="uppercase" fontWeight="semibold">
              Profit & Loss
            </Text>
            <Text color={color} fontSize="xl" fontWeight="bold">
              {fmt.format(pnl)}
            </Text>
          </Flex>
        </GridItem>
      </Grid>
    );
  }
};

export type PortfolioListProps = {
  portfolios?: Portfolio[];
  title: string;
  isLoading: boolean;
  headerSlot?: React.ReactElement;
  period: number;
  exits?: boolean;
  onRecordClick?: (symbol: string) => void;
  recordUpdating?: boolean;
};

export const PortfolioList = ({
  portfolios,
  title,
  isLoading,
  headerSlot,
  period,
  exits,
  onRecordClick,
  recordUpdating,
}: PortfolioListProps) => {
  const [parentRef, { width }] = useMeasure<HTMLDivElement>();
  const sbw = useScrollbarWidth();
  const colCount = 5;
  const length = portfolios ? portfolios.length : 1;
  const rowCount =
    length === 0 ? 0 : Math.floor(length / colCount) + (length % 5 > 0 ? 1 : 0);
  const colWidth = Math.floor((width - (sbw || 0)) / colCount);
  const Cell = ({
    columnIndex,
    rowIndex,
    style,
  }: {
    columnIndex: number;
    rowIndex: number;
    style?: CSSProperties;
  }) => {
    const index = rowIndex * colCount + columnIndex;
    const pt = portfolios ? portfolios[index] : ({} as Portfolio);
    return (
      <div
        style={{
          ...style,
          paddingLeft: `0.5rem`,
          paddingTop: `0.5rem`,
          paddingRight: columnIndex === colCount - 1 ? `0.5rem` : `0`,
        }}
      >
        {pt ? (
          <PortfolioListItem
            period={period}
            exits={exits}
            onRecordClick={onRecordClick}
            recordUpdating={recordUpdating}
            key={pt.symbol}
            portfolio={pt}
          />
        ) : (
          <></>
        )}
      </div>
    );
  };
  return (
    <Box
      w="100%"
      mx="auto"
      rounded={{ md: `lg` }}
      bg={mode(`white`, `gray.700`)}
      shadow="md"
      overflow="hidden"
      ref={parentRef}
      position="relative"
    >
      <Flex align="center" justify="space-between" px="6" py="4">
        <Text as="h3" fontWeight="bold" fontSize="xl">
          {title}
        </Text>
        {headerSlot}
      </Flex>
      <Progress
        size="xs"
        w="100%"
        colorScheme="blue"
        isIndeterminate
        hidden={!isLoading}
        position="absolute"
      />
      <Divider />
      {portfolios && portfolios.length > 0 ? (
        <FixedSizeGrid
          style={{
            visibility: isLoading ? `hidden` : `visible`,
            padding: `0.5rem 0 0 0`,
          }}
          columnCount={colCount}
          columnWidth={colWidth}
          rowHeight={275}
          height={500}
          rowCount={rowCount}
          width={width}
        >
          {Cell}
        </FixedSizeGrid>
      ) : (
        <Center w="100%" h="500px">
          No data found
        </Center>
      )}
    </Box>
  );
};
