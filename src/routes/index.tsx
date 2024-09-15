import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="p-2">
			<div className="flex flex-col gap-2">
				<Link to="/sign-in">Sign In</Link>
				<Link to="/sign-up">Sign Up</Link>
			</div>
			<h3>This is Tanstack Router Yeah!!!</h3>
		</div>
	);
}
