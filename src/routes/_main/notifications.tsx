import IconBellOff from "~/assets/bell-off.svg?react";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	IconChevronLeft,
	IconChevronRight,
	IconCircleCheck,
} from "justd-icons";
import { z } from "zod";
import { userNotificationsQueryOptions } from "~lib/query-options";
import { Button } from "~ui/button";
import { Heading } from "~ui/heading";
import { Switch } from "~ui/switch";
import { Card } from "~ui/card";
import { Avatar } from "~ui/avatar";
import { NotificationsSkeleton } from "~components/notifications-skeleton";
import { useEffect } from "react";
import { supabase } from "~lib/supabase";
import { toast } from "sonner";
import { EmptyState } from "~components/empty-state";

// Define the Notification type here if it's not available in a separate file
interface Notification {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	isRead: boolean;
	senderId: string;
	receiverId: string;
	user?: {
		id: string;
		name: string;
		email: string;
	};
}

const notificationFilterSchema = z.object({
	status: z.enum(["all", "unread"]).default("all").catch("all"),
	page: z.number().positive().default(1).catch(1),
	pageSize: z.number().positive().default(10).catch(10),
});

export const Route = createFileRoute("/_main/notifications")({
	pendingComponent: NotificationsSkeleton,
	errorComponent: (error) => <div>Error: {error.error.message}</div>,
	validateSearch: notificationFilterSchema,
	loaderDeps: ({ search: { page, pageSize, status } }) => ({
		page,
		pageSize,
		status,
	}),
	loader: ({ context, deps: { page, pageSize, status } }) => {
		context.queryClient.ensureQueryData(
			userNotificationsQueryOptions(
				context.session.user.id,
				page,
				pageSize,
				status,
			),
		);
		return {
			id: context.session.user.id,
			crumb: "Notifications",
			title: "Notifications",
		};
	},
	component: Notifications,
});

function Notifications() {
	const queryClient = useQueryClient();
	const navigate = Route.useNavigate();
	const search = Route.useSearch();
	const { id } = Route.useLoaderData();
	const { data, refetch } = useSuspenseQuery(
		userNotificationsQueryOptions(
			id,
			search.page,
			search.pageSize,
			search.status,
		),
	);

	const { mutateAsync: acceptDonationRequest } = useMutation({
		mutationKey: ["accept-donation-request"],
		mutationFn: async (donationRequestId: string) => {
			const { data, error } = await supabase.rpc(
				"accept_donation_request_with_chat",
				{
					request_id: donationRequestId,
					current_user_id: id,
				},
			);

			if (error) {
				console.error("Error accepting donation request:", error);
				throw new Error(error.message);
			}

			return data;
		},
		onError: (error) => {
			console.error("Error in acceptDonationRequest mutation:", error);
			// You might want to show an error message to the user here
		},
		onSuccess: () => {
			// Returning the promise would make the query stay in loading state untill the promise is resolved
			return Promise.all([
				queryClient.invalidateQueries({ queryKey: ["user-notifications"] }),
				queryClient.invalidateQueries({ queryKey: ["user-requests"] }),
				queryClient.invalidateQueries({
					queryKey: ["active-requests-received"],
				}),
				queryClient.invalidateQueries({ queryKey: ["active-requests-sent"] }),
				queryClient.invalidateQueries({ queryKey: ["user-chats"] }),
			]);
		},
	});

	const { mutateAsync } = useMutation({
		mutationKey: ["mark-notifications-as-read"],
		mutationFn: async () => {
			const { data, error } = await supabase
				.from("notifications")
				.update({ isRead: true })
				.eq("receiverId", id);

			if (error) {
				console.error("Error marking notifications as read:", error);
				throw new Error(error.message);
			}

			return data;
		},

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user-notifications"],
				refetchType: "all",
			});
		},
	});

	useEffect(() => {
		const channel = supabase
			.channel("notifications")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "notifications",
					filter: `receiverId=eq.${id}`,
				},
				async (payload) => {
					console.log("New notification received:", payload.new);
					// Refetch the notifications to include the new one
					refetch();
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [id, refetch]);

	const notifications = data.notifications;

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
				<Button
					onPress={() => {
						toast.promise(mutateAsync(), {
							loading: "Marking all notifications as read...",
							success: "All notifications marked as read!",
							error: "Error marking all notifications as read.",
						});
					}}
					size="extra-small"
					intent="secondary"
					isDisabled={notifications.length === 0}
				>
					<IconCircleCheck />
					Mark all as read
				</Button>
				<Switch
					intent="secondary"
					className="text-xs font-medium"
					isSelected={search.status === "unread"}
					onChange={(val) => {
						navigate({
							search: (prev) => ({
								...prev,
								status: val ? "unread" : "all",
							}),
						});
					}}
				>
					Show Unread Only
				</Switch>
			</div>
			{notifications.length > 0 ? (
				<>
					<div className="space-y-4">
						{notifications.map((notification) => (
							<Card key={notification.id} className="p-4">
								<div className="flex items-start gap-4">
									<Avatar
										size="medium"
										src={`https://i.pravatar.cc/300?u=${notification.user?.email}`}
										initials={
											notification.user?.name
												?.split(" ")
												.map((word) => word.charAt(0).toUpperCase())
												.join("") ?? ""
										}
									/>
									<div className="flex-1">
										<p className="text-sm font-semibold">
											{notification.title}
										</p>
										<p className="text-xs md:text-sm text-muted-fg mt-1">
											{notification.content}
										</p>
										{notification.type === "book_request" &&
										notification.donation_request_id &&
										notification.donation_request?.status === "PENDING" ? (
											<div className="mt-2 flex items-center gap-2">
												<Button size="extra-small" intent="secondary">
													Decline
												</Button>
												<Button
													onPress={() => {
														if (!notification.donation_request_id) {
															toast.error("Donation request ID is null");
															return;
														}
														toast.promise(
															acceptDonationRequest(
																notification.donation_request_id,
															),
															{
																loading: "Accepting donation request...",
																success: "Donation request accepted!",
																error: "Error accepting donation request.",
															},
														);
													}}
													size="extra-small"
													intent="primary"
												>
													Accept
												</Button>
											</div>
										) : null}
										<div className="flex items-center justify-between">
											<p className="text-xs text-muted-fg mt-2">
												{new Date(notification.createdAt).toLocaleString(
													"en-US",
													{
														year: "numeric",
														month: "short",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													},
												)}
											</p>
											<p className="text-xs text-muted-fg mt-2">
												{(() => {
													const now = new Date();
													const createdAt = new Date(notification.createdAt);
													const diffInSeconds = Math.floor(
														(now.getTime() - createdAt.getTime()) / 1000,
													);

													if (diffInSeconds < 60) return "Just now";
													if (diffInSeconds < 3600)
														return `${Math.floor(diffInSeconds / 60)}m ago`;
													if (diffInSeconds < 86400)
														return `${Math.floor(diffInSeconds / 3600)}h ago`;
													if (diffInSeconds < 2592000)
														return `${Math.floor(diffInSeconds / 86400)}d ago`;
													if (diffInSeconds < 31536000)
														return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
													return `${Math.floor(diffInSeconds / 31536000)}y ago`;
												})()}
											</p>
										</div>
									</div>
									{!notification.isRead && (
										<div className="w-2 h-2 bg-primary rounded-full" />
									)}
								</div>
							</Card>
						))}
					</div>
					<div className="mt-4 flex justify-between items-center">
						<Button
							intent="secondary"
							size="extra-small"
							isDisabled={search.page <= 1}
							onPress={() =>
								navigate({
									search: (prev) => ({ ...prev, page: prev.page - 1 }),
								})
							}
						>
							<IconChevronLeft />
							Prev
						</Button>
						<div className="text-center text-xs sm:text-sm text-muted-fg">
							Page {search.page} of{" "}
							{Math.ceil((data?.totalCount ?? 0) / (data?.pageSize ?? 10))}
						</div>
						<Button
							intent="secondary"
							size="extra-small"
							isDisabled={
								!data ||
								search.page >= Math.ceil(data.totalCount / data.pageSize)
							}
							onPress={() =>
								navigate({
									search: (prev) => ({ ...prev, page: prev.page + 1 }),
								})
							}
						>
							Next
							<IconChevronRight />
						</Button>
					</div>
				</>
			) : (
				<EmptyState
					icon={IconBellOff}
					title="No notifications"
					description="You're all caught up! There are no notifications to display at the moment."
				/>
			)}
		</div>
	);
}
