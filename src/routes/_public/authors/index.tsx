import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/authors/")({
	component: () => <div>Hello /_public/authors/!</div>,
});
