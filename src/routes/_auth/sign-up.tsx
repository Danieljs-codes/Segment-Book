import { createFileRoute, Link } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "~lib/schema";
import type { z } from "zod";
import { TextField } from "~ui/text-field";
import {
	IconBrandGoogle,
	IconCircleCheckFill,
	IconEye,
	IconEyeOff,
} from "justd-icons";
import { Button } from "~ui/button";
import { useMemo, useState } from "react";
import { cn } from "~ui/primitive";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "~lib/supabase";
import { Loader } from "~ui/loader";
import { useAuth } from "~lib/auth";
import { toast } from "sonner";
import { flushSync } from "react-dom";
import { linkStyles } from "~ui/link";

export const Route = createFileRoute("/_auth/sign-up")({
	component: SignUpComponent,
});

function SignUpComponent() {
	const { updateSession } = useAuth();
	const navigate = Route.useNavigate();
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const { mutate, isPending, error } = useMutation({
		mutationKey: ["sign-up"],
		mutationFn: async (data: z.infer<typeof signUpSchema>) => {
			const { data: authData, error: authError } = await supabase.auth.signUp({
				email: data.email,
				password: data.password,
				options: {
					data: {
						full_name: data.fullName,
						username: fullNameToKebabCase(data.fullName),
					},
				},
			});
			if (authError) {
				console.log(authError);
				throw authError;
			}

			return authData;
		},
		onSuccess: (data) => {
			// Forcing react to update state which update the context before navigating
			flushSync(() => {
				updateSession(data.session);
			});
			toast.success("Sign up successful!");
			navigate({ to: "/" });
		},

		onError: (error) => {
			console.log(error);
			toast.error(error.message);
		},
	});

	const { handleSubmit, control, watch } = useForm<
		z.infer<typeof signUpSchema>
	>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
		},
	});

	const password = watch("password");

	const { isLengthValid, hasSpecialChar } = useMemo(() => {
		return {
			isLengthValid: password.length >= 8,
			hasSpecialChar: /.*[@$!%*?&].*/.test(password),
		};
	}, [password]);

	const onSubmit = (data: z.infer<typeof signUpSchema>) => {
		mutate(data);
	};

	return (
		<div>
			<div className="text-center mb-8">
				<h1 className="text-2xl font-semibold text-fg mb-2">
					Create an account
				</h1>
				<p className="text-sm font-normal text-muted-fg">
					Start your 30-day free trial.
				</p>
			</div>
			{error && (
				<div className="text-error text-sm mb-4">
					{error instanceof Error
						? error.message
						: "An error occurred during sign up."}
				</div>
			)}
			<form
				onSubmit={handleSubmit(onSubmit)}
				id="sign-up-form"
				className="flex flex-col gap-5"
			>
				<Controller
					control={control}
					name="fullName"
					render={({ field, fieldState: { error } }) => (
						<TextField
							label="Full Name"
							autoComplete="new-fullName"
							placeholder="Enter your full name"
							isInvalid={!!error}
							errorMessage={error?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					control={control}
					name="email"
					render={({ field, fieldState: { error } }) => (
						<TextField
							label="Email"
							autoComplete="new-email"
							placeholder="Enter your email"
							type="email"
							isInvalid={!!error}
							errorMessage={error?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					control={control}
					name="password"
					render={({ field, fieldState: { error } }) => (
						<TextField
							label="Password"
							autoComplete="new-password"
							placeholder="Enter your password"
							type={isPasswordVisible ? "text" : "password"}
							isInvalid={!!error}
							errorMessage={error?.message}
							{...field}
							suffix={
								<Button
									size="square-petite"
									appearance="plain"
									onPress={() => setIsPasswordVisible((v) => !v)}
								>
									{isPasswordVisible ? <IconEyeOff /> : <IconEye />}
								</Button>
							}
						/>
					)}
				/>
			</form>
			<div className="mt-5 mb-6 space-y-1">
				<div className="flex gap-x-1">
					<IconCircleCheckFill
						className={cn(
							"text-muted-fg size-5",
							isLengthValid && "text-success",
						)}
					/>
					<span className="text-sm text-muted-fg">
						Must be at least 8 characters
					</span>
				</div>
				<div className="flex gap-x-1">
					<IconCircleCheckFill
						className={cn(
							"text-muted-fg size-5",
							hasSpecialChar && "text-success",
						)}
					/>
					<span className="text-sm text-muted-fg">
						Must contain at least one special character
					</span>
				</div>
			</div>
			<div className="space-y-3">
				<Button
					form="sign-up-form"
					size="small"
					type="submit"
					className="w-full"
					isDisabled={isPending}
				>
					{isPending ? <Loader variant="spin" /> : "Get started"}
				</Button>
				<Button
					size="small"
					type="button"
					className="w-full"
					intent="secondary"
				>
					<IconBrandGoogle />
					Sign up with Google
				</Button>
			</div>
			<p className="text-sm text-muted-fg text-center mt-6">
				Already have an account?{" "}
				<Link
					className={linkStyles({
						intent: "primary",
						className: "font-medium",
					})}
					to="/sign-in"
				>
					Sign in
				</Link>
			</p>
		</div>
	);
}
