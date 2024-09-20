import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
	component: Home,
});

function Home() {
	return (
		<div>
			<h3>This is the layout for unauthenticated routes</h3>
			<Outlet />
		</div>
	);
}
