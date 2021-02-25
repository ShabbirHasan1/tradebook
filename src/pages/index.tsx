import useSWR from 'swr';
import { Box, List, ListItem, HStack, Button } from '@chakra-ui/react';
import { Summary } from '@/common/types';

export default function Home() {
  const fetcher = (...args: Parameters<typeof fetch>) =>
    fetch(...args).then((response) => response.json());
  const { data, error } = useSWR<Summary[]>(`/api/summary`, fetcher);
  if (error) return <div>An error occured.</div>;
  if (!data) return <div>Loading ...</div>;

  const hover = { bg: `blue.600` };

  return (
    <Box w="100%">
      <HStack bg="blue.500" py={4} w="100%" px={32} spacing={2}>
        <Button
          as="a"
          bg="blue.700"
          color="white"
          _hover={hover}
          _active={hover}
        >
          Summary
        </Button>
        <Button
          as="a"
          bg="transparent"
          color="white"
          _hover={hover}
          _active={hover}
        >
          Tradebook
        </Button>
        <Button
          as="a"
          bg="transparent"
          color="white"
          _hover={hover}
          _active={hover}
        >
          Holding
        </Button>
      </HStack>
      <Box bg="white" rounded={6} my={8} py={8} mx={32} px={8}>
        <List spacing={4}>
          {data.map((sum) => {
            if (sum.quantity > 0)
              return (
                <ListItem bg="green.100" key={sum.symbol + sum.exchange}>
                  <Box>{sum.name}</Box>
                  <Box>{sum.exchange}</Box>
                  <Box>{sum.quantity}</Box>
                </ListItem>
              );
            return (
              <ListItem bg="red.100" key={sum.symbol + sum.exchange}>
                <Box>{sum.name}</Box>
                <Box>{sum.exchange}</Box>
                <Box>{sum.quantity}</Box>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
