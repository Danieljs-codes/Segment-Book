import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
	component: HomeComponent,
});

function HomeComponent() {
	return <div>Home</div>;
}
