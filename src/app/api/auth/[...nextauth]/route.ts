import NextAuth from 'next-auth/next';
import { authOptions } from '@/src/app/_lib/next-auth/authOptions';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
