import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { ClientsTable } from '../../../../../drizzle/schema'; // Adjust the import path to your schema file
import { eq } from 'drizzle-orm';


const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET!,
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      console.log("JWT callback");
      console.log("Token before:", token);

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.picture || user.image; // Use image if available, otherwise use picture

        // Check if the user exists in the database
        const db = drizzle(sql);
        const existingUsers = await db
          .select()
          .from(ClientsTable)
          .where(eq(ClientsTable.email, user.email))
          .execute();

        if (existingUsers.length === 0) {
          // If the user does not exist, insert their information
          await db
            .insert(ClientsTable)
            .values({
              fullname: user.name,
              email: user.email,
            })
            .execute();
        }
      }

      console.log("Token after:", token);
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log("Session callback");
      console.log("Session before:", session);
      console.log("Token:", token);

      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }

      console.log("Session after:", session);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
