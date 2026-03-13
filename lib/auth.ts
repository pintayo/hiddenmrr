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
      if (!user.email || !user.id || !account?.access_token) return false;

      // Sync user profile to Supabase on first login
      const { error } = await supabaseAdmin
        .from('profiles')
        .upsert(
          { 
            id: user.id, 
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
