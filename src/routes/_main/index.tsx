import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="p-2">
			<div className="flex flex-col gap-2">This is the Home Page</div>
			<h3>This is Tanstack Router Yeah!!!</h3>
		</div>
	);
}
