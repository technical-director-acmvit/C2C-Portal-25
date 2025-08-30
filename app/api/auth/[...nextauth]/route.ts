import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user?: User
    idToken?: string
    error?: string
  }

  interface User {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    idToken?: string
    error?: string
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          // hd hint helps prefer this domain if applicable
          hd: 'vitstudent.ac.in',
          scope: 'openid email profile',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // On initial sign-in, persist the Google ID token for backend auth
      if (account?.id_token) {
        token.idToken = account.id_token as string;
      }
      // Attach a stable userId if available from profile
      if (profile && typeof profile.sub === 'string') {
        token.userId = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) session.user = {};
      session.idToken = token.idToken;
      if (token.userId) session.user.id = token.userId;
      if (token.error) session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
})

export { handler as GET, handler as POST }
