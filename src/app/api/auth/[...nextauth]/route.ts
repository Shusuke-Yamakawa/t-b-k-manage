import { authOptions } from "@/src/app/_lib/next-auth/authOptions";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
