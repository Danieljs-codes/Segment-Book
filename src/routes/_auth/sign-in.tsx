import { createFileRoute, Link } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "~lib/schema";
import type { z } from "zod";
import { TextField } from "~ui/text-field";
import { IconBrandGoogle, IconEye, IconEyeOff } from "justd-icons";
import { Button } from "~ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "~lib/supabase";
import { Loader } from "~ui/loader";
import { useAuth } from "~lib/auth";
import { toast } from "sonner";
import { flushSync } from "react-dom";
import { linkStyles } from "~ui/link";

export const Route = createFileRoute("/_auth/sign-in")({
	component: SignInComponent,
});

function SignInComponent() {
	const { updateSession } = useAuth();
	const navigate = Route.useNavigate();
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const { mutate, isPending, error } = useMutation({
		mutationKey: ["sign-in"],
		mutationFn: async (data: z.infer<typeof signInSchema>) => {
			const { data: authData, error: authError } =
				await supabase.auth.signInWithPassword({
					email: data.email,
					password: data.password,
				});
			if (authError) {
				console.log(authError);
				throw authError;
			}
			return authData;
		},
		onSuccess: (data) => {
			flushSync(() => {
				updateSession(data.session);
			});
			toast.success("Sign in successful!");
			navigate({ to: "/" });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { handleSubmit, control } = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (data: z.infer<typeof signInSchema>) => {
		mutate(data);
	};

	return (
		<div>
			<div className="text-center mb-8">
				<h1 className="text-2xl font-semibold text-fg mb-2">
					Sign in to your account
				</h1>
				<p className="text-sm font-normal text-muted-fg">
					Welcome back! Please enter your details.
				</p>
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				id="sign-in-form"
				className="flex flex-col gap-5"
			>
				<Controller
					control={control}
					name="email"
					render={({ field, fieldState: { error } }) => (
						<TextField
							label="Email"
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
			<div className="space-y-3 mt-6">
				<Button
					form="sign-in-form"
					size="small"
					type="submit"
					className="w-full"
					isDisabled={isPending}
				>
					{isPending ? <Loader variant="spin" /> : "Sign in"}
				</Button>
				<Button
					size="small"
					type="button"
					className="w-full"
					intent="secondary"
				>
					<IconBrandGoogle />
					Sign in with Google
				</Button>
			</div>
			<p className="text-sm text-muted-fg text-center mt-6">
				Don't have an account?{" "}
				<Link
					className={linkStyles({
						intent: "primary",
						className: "font-medium",
					})}
					to="/sign-up"
				>
					Sign up
				</Link>
			</p>
		</div>
	);
}
