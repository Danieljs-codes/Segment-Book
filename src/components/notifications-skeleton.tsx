import { IconCircleCheck } from "justd-icons";
import { Button } from "~ui/button";
import { Card } from "~ui/card";
import { Heading } from "~ui/heading";
import { Skeleton } from "~ui/skeleton";
import { Switch } from "~ui/switch";

export function NotificationsSkeleton() {
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
			<div className="flex items-center justify-between mb-6">
				<Button size="extra-small" intent="secondary">
					<IconCircleCheck />
					Mark all as read
				</Button>
				<Switch intent="secondary" className="text-xs font-medium">
					Show Unread Only
				</Switch>
			</div>
			<div className="space-y-4">
				{[...Array(5)].map((_, index) => (
					<Card key={index} className="p-4">
						<div className="flex items-start gap-4">
							<Skeleton shape="circle" className="w-10 h-10" />
							<div className="flex-1">
								<Skeleton className="w-3/4 h-4 mb-2" />
								<Skeleton className="w-full h-3 mb-2" />
								<div className="flex items-center justify-between">
									<Skeleton className="w-24 h-3" />
									<Skeleton className="w-16 h-3" />
								</div>
							</div>
							<Skeleton className="w-2 h-2 rounded-full" />
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
