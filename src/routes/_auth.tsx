import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Logo } from "~components/logo";

export const Route = createFileRoute("/_auth")({
	component: AuthComponent,
});

function AuthComponent() {
	return (
		<div>
			<div className="h-full flex flex-col items-center pt-12 md:pt-24 px-4">
				<Logo className="mb-6" />
				<div className="w-full max-w-[400px]">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
