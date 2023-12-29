import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db } from "@/lib/db";

const handler = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const response = await db.user.findMany({
          where: {
            email: credentials?.email,
          },
        });
        const user = response[0];
        const uniqueUser = await db.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });
        if (!uniqueUser) {
          throw new Error("Email Not registered!");
        }

        const passwordCorrect = await compare(
          credentials?.password || "",
          user.password
        );
        if (passwordCorrect) {
          return {
            id: user.id,
            email: user.email,
          };
        }
        if (!passwordCorrect) {
          throw new Error("Incorrect Password!");
        }

        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
