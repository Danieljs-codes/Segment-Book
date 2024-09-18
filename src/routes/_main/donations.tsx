import { createFileRoute } from "@tanstack/react-router";
import { Heading } from "~ui/heading";

export const Route = createFileRoute("/_main/donations")({
	loader: () => {
		return {
			crumb: "Donations",
			title: "Donations",
		};
	},
	component: Donations,
});

function Donations() {
	return (
		<div>
			<Heading level={1} tracking="tight">
				Donations
			</Heading>
		</div>
	);
}
