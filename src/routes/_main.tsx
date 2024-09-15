import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "~lib/auth";

export const Route = createFileRoute("/_main")({
	beforeLoad: ({ context }) => {
		const { session, isLoading } = context.auth;

		if (isLoading) {
			// Return a promise that resolves when loading is complete
			return new Promise((resolve) => {
				const checkAuth = () => {
					if (!context.auth.isLoading) {
						if (context.auth.session) {
							resolve(true);
						} else {
							toast.error("You must be signed in to access this page.");
							throw redirect({
								to: "/sign-in",
							});
						}
					} else {
						setTimeout(checkAuth, 50); // Check again after 50ms
					}
				};
				checkAuth();
			});
		}

		if (!session) {
			toast.error("You must be signed in to access this page.");
			throw redirect({
				to: "/sign-in",
			});
		}

		return session;
	},
	component: MainLayout,
});

function MainLayout() {
	const { isLoading } = useAuth();
	

	if (isLoading) {
		return <div>Loading...</div>; // Or a proper loading component
	}

	return (
		<div className="p-2">
			<Outlet />
		</div>
	);
}
