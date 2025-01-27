"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

const NextAuthProvider = ({ children }: { children: ReactNode }) => (
  <SessionProvider>{children}</SessionProvider>
);

export default NextAuthProvider;
