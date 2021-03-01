import { ButtonGroup, Button } from '@chakra-ui/react';

export type ExchangeButtonProps = {
  exchange: string;
  onChange: (exchange: string) => void;
};

export const ExchangeButton = ({ exchange, onChange }: ExchangeButtonProps) => (
  <ButtonGroup size="lg" isAttached>
    <Button
      variant={exchange === `NSE` ? `solid` : `outline`}
      color={exchange === `NSE` ? `white` : `blue.400`}
      onClick={() => onChange(`NSE`)}
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
      onClick={() => onChange(`BSE`)}
      bg={exchange === `BSE` ? `blue.400` : `transparent`}
      borderWidth={2}
      borderColor="blue.400"
      _hover={{ bg: exchange === `BSE` ? `blue.400` : `blue.50` }}
      _active={{ bg: exchange === `BSE` ? `blue.400` : `blue.50` }}
    >
      BSE
    </Button>
  </ButtonGroup>
);
