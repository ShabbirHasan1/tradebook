import { Stack, Center } from '@chakra-ui/react';
import { Layout } from '@/components/layout';
import { ExchangeButton } from '@/components/exchange-button';
import { useState } from 'react';

export default function Exchange() {
  const [exchange, setExchange] = useState(`NSE`);
  return (
    <Layout title="Exchange">
      <Stack spacing={4}>
        <Center>
          <ExchangeButton
            exchange={exchange}
            onChange={(ex) => setExchange(ex)}
          />
        </Center>
      </Stack>
    </Layout>
  );
}
