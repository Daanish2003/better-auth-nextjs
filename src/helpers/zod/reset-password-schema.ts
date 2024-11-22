import { z } from "zod";

export const ResetPasswordSchema = z.object({
    password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(64, { message: "Password must be at most 64 characters long" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(64, { message: "Password must be at most 64 characters long" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});