'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tooltip, UnstyledButton, rem } from '@mantine/core';
import { signOut } from 'next-auth/react';
import { IconHome2, IconLogout } from '@tabler/icons-react';
import classes from './Navbar.module.css';

type NavbarLinkProps = {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
};

const NavbarLink = ({ icon: Icon, label, active, onClick }: NavbarLinkProps) => (
  <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
    <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
      <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
    </UnstyledButton>
  </Tooltip>
);

const data = [
  { link: '/court', label: 'court' },
  { link: '/entry', label: 'entry' },
  { link: '/card', label: 'card' },
  { link: '/manage', label: 'manage' },
];

export const Navbar = () => {
  const pathname = usePathname();
  const links = data.map((item) => (
    <Link
      href={item.link}
      className={classes.link}
      data-active={item.link === pathname || undefined}
      key={item.label}
    >
      <span>{item.label}</span>
    </Link>
  ));
  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>
      <NavbarLink
        icon={IconLogout}
        label="Logout"
        onClick={async () => {
          console.log('logout');
          await signOut();
          window.location.href = '/login';
        }}
      />
    </nav>
  );
};
