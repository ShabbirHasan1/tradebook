import { Box, Heading, Flex, ButtonGroup, Button } from '@chakra-ui/react';
import { Nav } from '@/components/nav';

export type LayoutProps = {
  title?: string;
  children: React.ReactNode;
  prevFunc?: () => void;
  nextFunc?: () => void;
};

export const Layout = ({
  children,
  title,
  prevFunc,
  nextFunc,
}: LayoutProps) => (
  <Box w="100%">
    <Nav />
    <Flex px={64} w="100%" bg="white" color="blue.400" py={10}>
      <Heading flexBasis="100%">{title}</Heading>
      <ButtonGroup variant="outline" size="lg" isAttached>
        <Button
          borderColor="blue.400"
          mr="-px"
          onClick={() => prevFunc && prevFunc()}
        >
          Prev
        </Button>
        <Button borderColor="blue.400" onClick={() => nextFunc && nextFunc()}>
          Next
        </Button>
      </ButtonGroup>
    </Flex>
    <Box bg="white" rounded={6} my={8} py={8} mx={64} px={8}>
      {children}
    </Box>
  </Box>
);
