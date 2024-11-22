import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins"
import prisma from "../db";
import { resend } from "@/helpers/email/resend";
import { nextCookies } from "better-auth/next-js";

// const from = process.env.BETTER_AUTH_EMAIL || "delivered@resend.dev";
// const to = process.env.TEST_EMAIL || "";

export const auth = betterAuth({
  appName: "better_auth_nextjs",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    maxPasswordLength: 20,
    minPasswordLength: 8,
    requireEmailVerification: true,
    autoSignIn: false
  },
  emailVerification: {
     sendOnSignUp: true,
     autoSignInAfterVerification: false,
     sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: user.email,
        subject: "Two Factor",
        html: `Click the link to verify your email: ${url}`
      })
     },
     account: {
       accountLinking: {
          trustedProviders: ['github']
       }
     }
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      redirectURI: process.env.BETTER_AUTH_URL + "/api/auth/callback/github",
    },
  },
  plugins: [
    twoFactor({
      otpOptions: {
        async sendOTP({user, otp}) {
          await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: user.email,
            subject: "Two Factor",
            html: `Your OTP is ${otp}`
          })
          
        }
      },
      skipVerificationOnEnable: true
    }),
    nextCookies()
  ]
});
