import { createFileRoute } from "@tanstack/react-router";
import { IconCircleCheck } from "justd-icons";
import { Button } from "~ui/button";
import { Heading } from "~ui/heading";

export const Route = createFileRoute("/_main/notifications")({
	loader: () => {
		return {
			crumb: "Notifications",
			title: "Notifications",
		};
	},
	component: Notifications,
});

function Notifications() {
	return (
		<div>
			<div className="mb-6 mt-2">
				<Heading level={2} tracking="tight">
					Notifications
				</Heading>
				<p className="text-xs md:text-sm text-muted-fg mt-1">
					This is where you can view and manage all your notifications.
				</p>
			</div>
			<div className="flex items-center justify-between">
				<Button size="extra-small" intent="secondary">
					<IconCircleCheck />
					Mark all as read
				</Button>
        
			</div>
		</div>
	);
}
