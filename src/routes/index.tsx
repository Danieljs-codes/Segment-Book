import { createFileRoute, Link } from "@tanstack/react-router";
import { linkStyles } from "~ui/link";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="p-4">
			<div className="flex flex-col gap-2">This is the Home Page</div>
			<h3>This is Tanstack Router Yeah!!!</h3>
			<Link className={linkStyles({ intent: "primary" })} to="/dashboard">
				Sign In
			</Link>
			<Link
				className={linkStyles({ intent: "secondary", className: "block" })}
				to="/dashboard"
			>
				Dashboard
			</Link>
		</div>
	);
}
