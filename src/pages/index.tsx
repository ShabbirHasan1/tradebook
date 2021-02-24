import useSWR from 'swr';
import { Box, List, ListItem } from '@chakra-ui/react';

export type Summary = {
  symbol: string;
  exchange: string;
  sum: {
    quantity: number;
  };
};

export default function Home() {
  const fetcher = (...args: Parameters<typeof fetch>) =>
    fetch(...args).then((response) => response.json());
  const { data, error } = useSWR<Summary[]>(`/api/summary`, fetcher);
  if (error) return <div>An error occured.</div>;
  if (!data) return <div>Loading ...</div>;

  return (
    <Box>
      <List>
        {data.map((sum) => (
          <ListItem key={sum.symbol}>
            <Box>{sum.symbol}</Box>
            <Box>{sum.exchange}</Box>
            <Box>{sum.sum.quantity}</Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
