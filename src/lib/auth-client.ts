import { createAuthClient } from "better-auth/react"
import { twoFactorClient } from "better-auth/client/plugins"

export const {
    signUp,
    signIn,
    signOut,
    getSession,
    useSession,
    twoFactor,
    forgetPassword,
    resetPassword
} = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        twoFactorClient({
        redirect: true,
        twoFactorPage: "/two-factor",
    })]

})