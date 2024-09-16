import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/dashboard")({
	loader: ({ context }) => {
		const { session } = context;
		return {
			crumb: "Overview",
			title: `Welcome back, ${session?.user?.user_metadata?.full_name
				?.split(" ")
				.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ")}`,
		};
	},
	component: OverviewComponent,
});

function OverviewComponent() {
	const { title } = Route.useLoaderData();

	return (
		<div>
			<h2 className="text-lg font-semibold">{title}</h2>
		</div>
	);
}
