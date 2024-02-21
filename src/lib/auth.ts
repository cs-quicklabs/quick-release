import { db } from "@/lib/db";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60, //1 hour,
  },
  cookies: {
    csrfToken: {
      name: "auth-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
    sessionToken: {
      name: "session-token",

      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const uniqueUser = await db.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });
        if (!uniqueUser) {
          throw new Error("InCorrect Credentials!");
        }
        if (uniqueUser && uniqueUser.isActive === false) {
          throw new Error("Your Access has been Restricted, Contact Admin");
        }

        const passwordCorrect = await compare(
          credentials?.password || "",
          uniqueUser.password
        );
        if (passwordCorrect) {
          return {
            user: uniqueUser,
            id: uniqueUser.id,
            email: uniqueUser.email,
          };
        }
        if (!passwordCorrect) {
          throw new Error("Incorrect Credentials!");
        }

        return uniqueUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
  },
};
