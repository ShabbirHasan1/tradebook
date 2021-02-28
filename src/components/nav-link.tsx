import { Button } from '@chakra-ui/react';
import Link from 'next/link';

export type NavLinkProps = {
  active?: boolean;
  children: React.ReactNode;
  href: string;
};

export const NavLink = ({ active, children, href }: NavLinkProps) => (
  <Link href={href}>
    <Button
      as="a"
      bg={active ? `blue.700` : `transparent`}
      color="white"
      _hover={{ bg: active ? `blue.700` : `blue.600` }}
      _active={{ bg: active ? `blue.700` : `blue.600` }}
    >
      {children}
    </Button>
  </Link>
);
