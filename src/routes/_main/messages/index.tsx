import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card } from "~ui/card";
import { Heading } from "~ui/heading";
import { Separator } from "~ui/separator";
import { SearchField } from "~ui/search-field";
import { userChatsQueryOptions } from "~lib/query-options";
import { Avatar } from "~ui/avatar";
import { Link } from "@tanstack/react-router";
import { Skeleton } from "~ui/skeleton";

export const Route = createFileRoute("/_main/messages/")({
	pendingComponent: MessagesSkeleton,
	pendingMinMs: 500,
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(
			userChatsQueryOptions({ userId: context.session.user.id }),
		);
		return {
			userId: context.session.user.id,
			crumb: "Messages",
			title: "Messages",
		};
	},
	component: Messages,
});

function Messages() {
	const { userId } = Route.useLoaderData();
	const { data: chats } = useSuspenseQuery(userChatsQueryOptions({ userId }));

	return (
		<div>
			<div className="mt-2 mb-1">
				<Heading level={2} tracking="tight">
					Donations
				</Heading>
			</div>
			<Separator className="mb-4" />
			<SearchField
				className="mb-4"
				placeholder="Search messages"
				aria-label="Search"
			/>
			<div>
				{chats.map((chat) => {
					const otherUser =
						(chat.requester as { id: string })?.id === userId
							? chat.donor
							: chat.requester;
					const lastMessage = (chat.messages as any[])?.[
						chat.messages.length - 1
					];

					if (!otherUser || !lastMessage) return null;

					return (
						<Link
							key={chat.id}
							to="/messages/$chatId"
							params={{ chatId: chat.id }}
							className="block"
						>
							<Card className="p-4 border-0 shadow-none hover:bg-muted transition-colors duration-200">
								<div className="flex items-start gap-2">
									<Avatar
										src={otherUser.avatar}
										alt={(otherUser as { name: string }).name}
										initials={(otherUser as { name: string }).name.charAt(0)}
										size="medium"
									/>
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<p className="text-sm font-medium">
												{(otherUser as { name: string }).name}
											</p>
											<p className="text-xs text-muted-fg">
												{(() => {
													const now = new Date();
													const createdAt = new Date(lastMessage.createdAt);
													const diffInSeconds = Math.floor(
														(now.getTime() - createdAt.getTime()) / 1000,
													);

													if (diffInSeconds < 60) return "just now";
													if (diffInSeconds < 3600)
														return `${Math.floor(diffInSeconds / 60)}m ago`;
													if (diffInSeconds < 86400)
														return `${Math.floor(diffInSeconds / 3600)}h ago`;
													if (diffInSeconds < 604800)
														return `${Math.floor(diffInSeconds / 86400)}d ago`;
													return `${Math.floor(diffInSeconds / 604800)}w ago`;
												})()}
											</p>
										</div>
										<p className="text-xs md:text-sm text-muted-fg mt-1 text-ellipsis line-clamp-2">
											{lastMessage.content}
										</p>
									</div>
								</div>
							</Card>
						</Link>
					);
				})}
			</div>
		</div>
	);
}

function MessagesSkeleton() {
	return (
		<div>
			<div className="mt-2 mb-1">
				<Skeleton className="h-8 w-40" />
			</div>
			<Separator className="mb-4" />
			<Skeleton className="h-10 w-full mb-4" />
			<div>
				{Array.from({ length: 5 }).map((_, index) => (
					<Card key={index} className="p-4 border-0 shadow-none mb-2">
						<div className="flex items-start gap-2">
							<Skeleton className="h-10 w-10 rounded-full" />
							<div className="flex-1">
								<div className="flex items-center justify-between">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-3 w-12" />
								</div>
								<Skeleton className="h-4 w-full mt-2" />
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
