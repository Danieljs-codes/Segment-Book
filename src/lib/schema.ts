import { z } from "zod";

export const signInSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(1, { message: "Password is required" }),
});

export const signUpSchema = z.object({
	fullName: z
		.string()
		.min(2, { message: "Full name must be at least 2 characters long" })
		.max(50, { message: "Full name must not exceed 50 characters" })
		.regex(/^[a-zA-Z\s'-]+$/, {
			message:
				"Full name can only contain letters, spaces, hyphens, and apostrophes",
		}),
	email: z
		.string()
		.email({ message: "Invalid email address" })
		.max(255, { message: "Email must not exceed 255 characters" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" })
		.max(72, { message: "Password must not exceed 72 characters" })
		.regex(/.*[@$!%*?&].*/, {
			message: "Password must contain at least one special character (@$!%*?&)",
		}),
});

export const donationSchema = z.object({
	title: z
		.string()
		.min(1, { message: "Title is required" })
		.max(100, { message: "Title must not exceed 100 characters" })
		.trim()
		.refine((value) => /^[\w\s.,!?'-]+$/.test(value), {
			message:
				"Title can only contain letters, numbers, spaces, and basic punctuation",
		}),
	description: z
		.string()
		.min(10, { message: "Description must be at least 10 characters long" })
		.max(500, { message: "Description must not exceed 500 characters" })
		.trim()
		.refine((value) => value.split(/\s+/).length >= 3, {
			message: "Description must contain at least 3 words",
		}),
	language: z.enum(["english", "spanish", "french", "german", "other"], {
		errorMap: () => ({ message: "Please select a valid language" }),
	}),
	condition: z.enum(["like new", "excellent", "good", "fair", "acceptable"], {
		errorMap: () => ({ message: "Please select a valid condition" }),
	}),
	tags: z
		.array(
			z
				.string()
				.min(2, { message: "Each tag must be at least 2 characters long" })
				.max(20, { message: "Each tag must not exceed 20 characters" })
				.trim()
				.refine((value) => /^[a-zA-Z0-9-\s]+$/.test(value), {
					message:
						"Tags can only contain letters, numbers, hyphens, and spaces",
				}),
		)
		.min(1, { message: "At least one tag is required" })
		.max(3, { message: "Maximum of 3 tags allowed" })
		.refine((tags) => new Set(tags).size === tags.length, {
			message: "All tags must be unique",
		}),
	image: z
		.instanceof(File, { message: "Image is required" })
		.refine((file) => file.size <= 5 * 1024 * 1024, {
			message: "Image must be no larger than 5MB",
		})
		.refine(
			(file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
			{
				message: "Only JPEG, PNG, and GIF images are allowed",
			},
		),
});

export type DonationFormData = z.infer<typeof donationSchema>;
