import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import bcrypt from "bcryptjs";
import clientPromise from "./mongodb";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || "",
      clientSecret: process.env.APPLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const client = await clientPromise;
        const db = client.db("tradesignal");
        
        const user = await db.collection("users").findOne({
          email: credentials.email,
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          tier: user.tier || "FREE",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.tier = user.tier;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.tier = token.tier;
      }
      return session;
    },
    async signIn({ user, account }) {
      // For OAuth providers (Google, Apple), ensure user has tier set
      if (account?.provider !== "credentials" && user.email) {
        const client = await clientPromise;
        const db = client.db("tradesignal");
        
        const existingUser = await db.collection("users").findOne({
          email: user.email,
        });

        // If new OAuth user, set default tier
        if (!existingUser) {
          await db.collection("users").updateOne(
            { email: user.email },
            {
              $setOnInsert: {
                tier: "FREE",
                monthlyAnalyses: 0,
                analysesResetDate: new Date(),
                createdAt: new Date(),
              },
            },
            { upsert: true }
          );
        } else if (!existingUser.tier) {
          // Update existing OAuth user without tier
          await db.collection("users").updateOne(
            { email: user.email },
            {
              $set: {
                tier: "FREE",
                monthlyAnalyses: 0,
                analysesResetDate: new Date(),
              },
            }
          );
        }
      }
      return true;
    },
  },
};
