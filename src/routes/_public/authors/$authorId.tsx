import { createFileRoute } from "@tanstack/react-router";
import { Heading } from "~ui/heading";

export const Route = createFileRoute("/_public/authors/$authorId")({
	component: Author,
});

function Author() {
	const { authorId } = Route.useParams();
	return (
		<div>
			<Heading className="mb-4" level={2} tracking="tight">
				Author Profile
			</Heading>
		</div>
	);
}
