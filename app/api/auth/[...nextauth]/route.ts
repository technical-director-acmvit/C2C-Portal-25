import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user?: User
    backendToken?: string
    error?: string
  }
  
  interface User {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    isAdmin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    backendToken?: string
    refreshToken?: string
    tokenExpiry?: number
    error?: string
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    if (!response.ok) {
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    const data = await response.json();
    
    return {
      ...token,
      backendToken: data.accessToken,
      userId: data.userId,
      tokenExpiry: data.expiresAt,
      error: undefined,
    };
  } catch (error) {
    return {
      ...token,
      error: error instanceof Error ? error.message : "RefreshAccessTokenError",
    };
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
          hd: 'vitstudent.ac.in',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: token,
              account: account,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to sync with backend');
          }

          const data = await response.json();
          
          return {
            ...token,
            backendToken: data.accessToken,
            refreshToken: data.refreshToken,
            userId: data.userId,
            tokenExpiry: data.expiresAt,
          };
        } catch (error) {
          console.error('Error syncing with backend:', error);
          return { ...token, error: "BackendSyncError" };
        }
      }

      if (token.tokenExpiry && Date.now() < token.tokenExpiry * 1000) {
        return token;
      }
      
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token) {
        if (!session.user) {
          session.user = {};
        }
        session.user.id = token.userId;
        session.backendToken = token.backendToken;
        
        try {
          const tokenData = JSON.parse(atob(token.backendToken?.split('.')[1] || ''));
          session.user.isAdmin = tokenData.isAdmin || false;
        } catch (error) {
          console.error('Error parsing token:', error);
          session.user.isAdmin = false;
        }
        
        if (token.error) {
          session.error = token.error;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
})

export { handler as GET, handler as POST }