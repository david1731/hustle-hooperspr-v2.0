import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      picture: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    picture: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    picture: string;
  }
}
