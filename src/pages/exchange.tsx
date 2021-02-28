import { Stack, Center, ButtonGroup, Button } from '@chakra-ui/react';
import { Layout } from '@/components/layout';
import { useState } from 'react';

export default function Exchange() {
  const [exchange, setExchange] = useState(`NSE`);
  return (
    <Layout title="Exchange">
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
      </Stack>
    </Layout>
  );
}
