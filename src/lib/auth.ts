import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Nodemailer from "next-auth/providers/nodemailer";

import client from "./mongodb-client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || "465"),
        secure: true, // true untuk port 465, false untuk port lainnya
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false, // untuk development, tidak disarankan untuk production
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    error: "/login",
    verifyRequest: "/verify-email",
    signIn: "/login",
  },
});
