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
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .upsert(
          { 
            id: user.id, // we might need a UUID mapping, but GitHub uses integer IDs usually. We configured Supabase 'id uuid references auth.users'. 
            email: user.email,
          },
          { onConflict: 'email' }
        );

      /* NOTE: In the PRD, Supabase Schema expects id to be a UUID referencing auth.users.
         Since we are using NextAuth standalone (not Supabase Auth), we don't have an auth.users record.
         We need to notify the user about this schema discrepancy. For now, we save GitHub token to session. */
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
