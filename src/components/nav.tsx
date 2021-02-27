import { HStack } from '@chakra-ui/react';
import { NavLink } from '@/components/nav-link';

export const Nav = () => (
  <HStack bg="blue.500" py={4} w="100%" px={64} spacing={2}>
    <NavLink active>Summary</NavLink>
    <NavLink>Exchange</NavLink>
    <NavLink>Tradebook</NavLink>
  </HStack>
);
