import { Summary } from '@/common/types';
import {
  Stat,
  StatLabel,
  StatNumber,
  Skeleton,
  ChakraProps,
  StatGroup,
} from '@chakra-ui/react';

type StatButtonProps = {
  label: string;
  value: number;
  helpText: string;
  color?: ChakraProps['color'];
};

const StatButton = ({ label, value, color }: StatButtonProps) => (
  <Stat
    textAlign="center"
    borderRight={1}
    borderStyle="solid"
    borderColor="gray.100"
    _last={{ borderRight: 0 }}
    p={6}
  >
    <StatLabel fontWeight="medium" isTruncated>
      {label}
    </StatLabel>
    <StatNumber fontSize="3xl" fontWeight="medium" color={color || `black`}>
      {value}
    </StatNumber>
  </Stat>
);

const StatLoader = () => (
  <Stat
    textAlign="center"
    borderRight={1}
    borderStyle="solid"
    borderColor="gray.100"
    _last={{ borderRight: 0 }}
    p={6}
  >
    <StatLabel fontWeight="medium" isTruncated>
      <Skeleton>Dummy</Skeleton>
    </StatLabel>
    <StatNumber fontSize="3xl" fontWeight="medium">
      <Skeleton>Dummy</Skeleton>
    </StatNumber>
  </Stat>
);

export type StatCardProps = {
  summary?: Summary[];
  date: Date;
};

export const SummaryCard = ({ summary, date: today }: StatCardProps) => {
  const options = {
    year: `numeric`,
    month: `short`,
  };
  return (
    <StatGroup
      boxShadow="md"
      border={1}
      borderStyle="solid"
      borderColor="gray.100"
      borderRadius={{ md: `lg` }}
      p={8}
      justifyItems="center"
    >
      {summary ? (
        summary.map((sum) => {
          const { key, label, value, indicator } = sum;
          return (
            <StatButton
              key={key}
              label={label}
              value={value}
              color={indicator === `p` ? `green.400` : `red.400`}
              helpText={`As on ${today.toLocaleDateString(`en-IN`, options)}`}
            />
          );
        })
      ) : (
        <>
          <StatLoader />
          <StatLoader />
          <StatLoader />
          <StatLoader />
          <StatLoader />
        </>
      )}
    </StatGroup>
  );
};
