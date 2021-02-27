import { Button } from '@chakra-ui/react';

export type NavLinkProps = {
  active?: boolean;
  children: React.ReactNode;
};

export const NavLink = ({ active, children }: NavLinkProps) => (
  <Button
    as="a"
    bg={active ? `blue.700` : `transparent`}
    color="white"
    _hover={{ bg: active ? `blue.700` : `blue.600` }}
    _active={{ bg: active ? `blue.700` : `blue.600` }}
  >
    {children}
  </Button>
);
