import { HStack } from '@chakra-ui/react';
import { NavLink } from '@/components/nav-link';
import { useRouter } from 'next/router';

export const Nav = () => {
  const router = useRouter();
  const path = router.pathname;

  return (
    <HStack bg="blue.500" py={4} w="100%" px={64} spacing={2}>
      <NavLink href="/" active={path === `/`}>
        Summary
      </NavLink>
      <NavLink href="/exchange" active={path === `/exchange`}>
        Exchange
      </NavLink>
      <NavLink href="/tradebook" active={path === `/tradebook`}>
        Tradebook
      </NavLink>
    </HStack>
  );
};
