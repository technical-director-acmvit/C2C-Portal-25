import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user?: User;
    idToken?: string;
    error?: string;
  }

  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    idToken?: string;
    error?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    email?: string;
  }
}

function hasExpiresIn(value: unknown): value is { expires_in: number } {
  return (
    !!value &&
    typeof value === "object" &&
    "expires_in" in (value as Record<string, unknown>) &&
    typeof (value as { expires_in?: unknown }).expires_in === "number"
  );
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent select_account",
          scope: "openid email profile",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({
      token,
      account,
      profile,
    }: {
      token: import("next-auth/jwt").JWT;
      account?: import("next-auth").Account | null;
      profile?: import("next-auth").Profile | undefined;
    }) {
      if (account) {
        if (account.id_token) token.idToken = account.id_token as string;
        if (account.access_token) token.accessToken = account.access_token as string;
        if (account.refresh_token) token.refreshToken = account.refresh_token as string;
        if (typeof account.expires_at === "number") {
          token.accessTokenExpires = account.expires_at * 1000;
        } else if (hasExpiresIn(account)) {
          const expiresIn = account.expires_in;
          token.accessTokenExpires = Date.now() + expiresIn * 1000;
        } else {
          token.accessTokenExpires = Date.now() + 55 * 60 * 1000;
        }
      }

      const googleProfile = profile as GoogleProfile | undefined;
      if (googleProfile && typeof googleProfile.sub === "string") {
        token.userId = googleProfile.sub;
      }

      if (googleProfile && typeof googleProfile.email === "string") {
        token.email = googleProfile.email;
      }

      const expires = token.accessTokenExpires ?? 0;
      if (token.accessToken && Date.now() < expires - 60_000) {
        return token;
      }

      if (!token.refreshToken) {
        return token;
      }

      try {
        const params = new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID as string,
          client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
          grant_type: "refresh_token",
          refresh_token: token.refreshToken,
        });
        const res = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
          cache: "no-store",
        });
        const refreshed = await res.json();
        if (!res.ok) {
          throw new Error(refreshed?.error || "Failed to refresh");
        }

        token.accessToken = refreshed.access_token ?? token.accessToken;
        token.idToken = refreshed.id_token ?? token.idToken;
        token.accessTokenExpires = Date.now() + (refreshed.expires_in ?? 3600) * 1000;
        if (refreshed.refresh_token) token.refreshToken = refreshed.refresh_token;
        delete token.error;
        return token;
      } catch {
        token.error = "RefreshAccessTokenError";
        return token;
      }
    },
    async session({
      session,
      token,
    }: {
      session: import("next-auth").Session;
      token: import("next-auth/jwt").JWT;
    }) {
      if (!session.user) session.user = {};
      session.idToken = token.idToken;
      if (token.userId) session.user.id = token.userId;
      if (token.error) session.error = token.error;
      if (token.email) session.user.email = token.email;
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
};

export const handler = NextAuth(authOptions);

interface GoogleProfile {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}
