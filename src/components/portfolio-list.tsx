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
  Button,
  SwitchProps,
} from '@chakra-ui/react';
import * as React from 'react';

export type PortfolioListItemProps = {
  portfolio: Portfolio;
};

export const PortfolioListItem = ({ portfolio }: PortfolioListItemProps) => {
  const {
    symbol,
    name,
    buy_qty,
    sell_qty,
    avg_buy_price,
    avg_sell_price,
    pnl,
  } = portfolio;
  {
    let bgColor = ``;
    let color = ``;
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
    return (
      <Flex
        as="dl"
        direction={{ base: `column`, sm: `row` }}
        px="6"
        py="4"
        bg={bgColor}
        border={1}
        borderStyle="solid"
        borderColor="gray.200"
        shadow="md"
        rounded={{ md: `lg` }}
      >
        <Box as="dt" flexBasis="100%">
          <Text fontSize="xl">{name}</Text>
          <Text fontSize="sm">
            {buy_qty} bought at ₹{avg_buy_price}
          </Text>
          <Text fontSize="sm">
            {sell_qty} sold at ₹{avg_sell_price}
          </Text>
        </Box>
        <Box as="dd" textAlign="right" flex="1">
          <Text>{symbol}</Text>
          <Text fontSize="xl" color={color}>
            {pnl}
          </Text>
          <Text fontSize="xs">P&L</Text>
        </Box>
      </Flex>
    );
  }
};

export type PortfolioListProps = {
  portfolios?: Portfolio[];
  onExit: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // value: SwitchProps['value'];
};

export const PortfolioList = ({
  portfolios,
  onExit,
}: // value,
PortfolioListProps) => (
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
        Portfolio
      </Text>
      <Box>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="email-alerts" mb="0">
            Only exits?
          </FormLabel>
          <Switch
            // value={value}
            onChange={(e) => onExit && onExit(e)}
            id="email-alerts"
          />
        </FormControl>
      </Box>
    </Flex>
    <Divider />
    <Grid
      p={4}
      gap={4}
      templateColumns="1fr 1fr"
      maxH="500px"
      minH="500px"
      overflowY="auto"
    >
      {portfolios && portfolios?.length > 0 ? (
        portfolios.map((pt) => (
          <GridItem key={pt.symbol}>
            <PortfolioListItem key={pt.symbol} portfolio={pt} />
          </GridItem>
        ))
      ) : (
        <GridItem colSpan={2} p={8}>
          <Center height="100%">No data found</Center>
        </GridItem>
      )}
    </Grid>
  </Box>
);
