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
  Switch,
  FormControl,
  FormLabel,
  Tooltip,
} from '@chakra-ui/react';

export type PositionListItemProps = {
  portfolio: Portfolio;
};

export const PositionListItem = ({ portfolio }: PositionListItemProps) => {
  const {
    symbol,
    name,
    buy_qty,
    sell_qty,
    avg_buy_price,
    avg_sell_price,
    pnl,
    exit_date,
  } = portfolio;
  {
    let bgColor = ``;
    let color = ``;
    let dateFmt = `P&L`;
    const mo = new Intl.DateTimeFormat(`en-In`, {
      month: `short`,
      day: `2-digit`,
      year: `numeric`,
    });
    if (buy_qty === sell_qty) {
      bgColor = `yellow.50`;
    } else if (buy_qty > 0) {
      bgColor = `green.50`;
    } else if (sell_qty > 0) {
      bgColor = `red.50`;
    }
    if (pnl === 0) {
      color = `inherent`;
    } else if (pnl > 0) {
      color = `green.400`;
    } else if (pnl < 0) {
      color = `red.400`;
    }
    if (exit_date) {
      const dt = new Date(exit_date);
      if (dt.getFullYear() > 1900) {
        dateFmt = mo.format(dt);
      }
    }
    return (
      <Grid
        as="dl"
        gridTemplateColumns="1fr 1fr"
        gridTemplateRows="min-content"
        px="6"
        py="4"
        bg={bgColor}
        border={1}
        borderStyle="solid"
        borderColor="gray.200"
        shadow="md"
        rounded={{ md: `lg` }}
      >
        <GridItem as="dt">
          <Box>
            <Tooltip label={name} aria-label={name}>
              <Text cursor="default" fontSize="xl" maxW="250px" isTruncated>
                {name}
              </Text>
            </Tooltip>
            <Text fontSize="sm">
              {buy_qty} bought at ₹{avg_buy_price}
            </Text>
            <Text fontSize="sm">
              {sell_qty} sold at ₹{avg_sell_price}
            </Text>
          </Box>
        </GridItem>
        <GridItem as="dd">
          <Box textAlign="right">
            <Text>{symbol}</Text>
            <Text fontSize="xl" color={color}>
              {pnl}
            </Text>
            <Text fontSize="xs">{dateFmt}</Text>
          </Box>
        </GridItem>
      </Grid>
    );
  }
};

export type PositionListProps = {
  portfolios?: Portfolio[];
  title: string;
  onExit?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const PositionList = ({
  portfolios,
  onExit,
  title,
}: PositionListProps) => (
  <Box
    w="100%"
    mx="auto"
    rounded={{ md: `lg` }}
    bg={mode(`white`, `gray.700`)}
    shadow="md"
    overflow="hidden"
  >
    <Flex align="center" justify="space-between" px="6" py="4">
      <Text as="h3" fontWeight="bold" fontSize="lg">
        {title}
      </Text>
      {onExit && (
        <Box>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="email-alerts" mb="0">
              Entry/Exit
            </FormLabel>
            <Switch
              colorScheme="red"
              onChange={(e) => onExit && onExit(e)}
              id="email-alerts"
            />
          </FormControl>
        </Box>
      )}
    </Flex>
    <Divider />
    <Grid
      p={4}
      gap={4}
      templateColumns="1fr 1fr 1fr"
      templateRows="min-content"
      maxH="500px"
      minH="500px"
      overflowY="auto"
    >
      {portfolios && portfolios?.length > 0 ? (
        portfolios.map((pt) => (
          <GridItem _last={{ mb: 4 }} key={pt.symbol}>
            <PositionListItem key={pt.symbol} portfolio={pt} />
          </GridItem>
        ))
      ) : (
        <GridItem colSpan={3} p={8}>
          <Center height="100%">No data found</Center>
        </GridItem>
      )}
    </Grid>
  </Box>
);
