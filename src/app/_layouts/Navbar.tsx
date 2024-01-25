'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@mantine/core';
import { signOut } from 'next-auth/react';
import classes from './Navbar.module.css';

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
      <Button
        color="gray"
        className={classes.logout}
        type="button"
        onClick={async () => {
          console.log('logout');
          await signOut();
          window.location.href = '/login';
        }}
      >
        ログアウト
      </Button>
    </nav>
  );
};
