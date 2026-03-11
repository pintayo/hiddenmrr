import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { supabaseAdmin } from "./supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email repo'
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email || !account?.access_token || !account?.providerAccountId) return false;

      // Sync user profile to Supabase on first login
      // CRITICAL: Use providerAccountId (GitHub numeric ID) as the row ID.
      // This is the same value passed to Lemon Squeezy checkout as user_id
      // and used by the webhook to find and update the profile row.
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .upsert(
          { 
            id: account.providerAccountId,
            email: user.email,
          },
          { onConflict: 'id' }
        );

      if (error) {
        console.error("Error syncing profile to Supabase:", error.code, error.message);
      }

      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.githubId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.githubId as string;
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
};

export const handler = NextAuth(authOptions);
