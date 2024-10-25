// auth.config.ts
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/src/data/user";

const googleProvider = Google({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

const githubProvider = Github({
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
});

const credentialsProvider = Credentials({
  async authorize(credentials) {
    const validatedFields = LoginSchema.safeParse(credentials);

    if (!validatedFields.success) return null;

    const { email, password } = validatedFields.data;
    const user = await getUserByEmail(email);

    if (!user || !user.password) return null;

    const passwordsMatch = await bcrypt.compare(password, user.password);
    return passwordsMatch ? user : null;
  },
});

export default {
  providers: [googleProvider, githubProvider, credentialsProvider],
} satisfies NextAuthConfig;
