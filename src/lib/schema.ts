import { z } from "zod";

export const signInSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const signUpSchema = z.object({
  fullName: z.string()
    .min(2, { message: "Full name must be at least 2 characters long" })
    .max(50, { message: "Full name must not exceed 50 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Full name can only contain letters, spaces, hyphens, and apostrophes" }),
  email: z.string()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must not exceed 255 characters" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(72, { message: "Password must not exceed 72 characters" })
    .regex(/.*[@$!%*?&].*/, {
      message: "Password must contain at least one special character (@$!%*?&)",
    }),
});