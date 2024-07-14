import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_SECRET:", process.env.GOOGLE_SECRET);
console.log("SECRET:", process.env.SECRET);

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }), 
    ],
    secret: process.env.SECRET!,
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }