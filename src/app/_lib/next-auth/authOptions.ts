/* eslint-disable no-param-reassign */
import CredentialsProvider from 'next-auth/providers/credentials';
import { randomUUID, randomBytes } from 'crypto';
import { findCardByIdAndPassword } from '@/src/app/_lib/db/card';

export const authOptions = {
  /* providers */
  providers: [
    // ユーザ用認証
    CredentialsProvider({
      id: 'user',
      name: 'User',
      credentials: {
        cardId: { label: 'Card ID', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        console.log('credentials: ', credentials);
        const user = await findCardByIdAndPassword(credentials!.cardId, credentials!.password);
        console.log('user: ', user);

        if (!user) {
          console.log('user does not exists');
          throw new Error('user does not exists');
        }

        return user;
      },
    }),
  ],

  /* callbacks */
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.user = user;
        const u = user as any;
        token.user_nm = u.user_nm;
        token.admin_flg = u.admin_flg;
      }

      return token;
    },
    session: ({ session, token }: any) => {
      if (token) {
        session.user.user_nm = token.user_nm;
        session.user.admin_flg = token.admin_flg;
      }
      return session;
    },
  },

  /* secret */
  secret: process.env.NEXTAUTH_SECRET,

  /* jwt */
  jwt: {
    maxAge: 3 * 24 * 60 * 60, // 3 days
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },

  /* session */
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    generateSessionToken: () => randomUUID?.() ?? randomBytes(32).toString('hex'),
  },
};
