import { Box, Heading, Flex, SlideFade } from '@chakra-ui/react';
import { Nav } from '@/components/nav';

export type LayoutProps = {
  title?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
};

export const Layout = ({ children, title, headerRight }: LayoutProps) => (
  <Box w="100%">
    <Nav />
    <Flex px={64} w="100%" bg="white" color="blue.400" py={10}>
      <Heading flexBasis="100%">{title}</Heading>
      {headerRight}
    </Flex>
    <SlideFade in offsetY="20px">
      <Box bg="white" rounded={6} my={8} py={8} mx={64} px={8}>
        {children}
      </Box>
    </SlideFade>
  </Box>
);
