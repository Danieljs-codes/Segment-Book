import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/authors/$authorId")({
	component: () => <div>Hello /_public/authors/$authorId!</div>,
});
