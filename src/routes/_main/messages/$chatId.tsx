import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { IconSend3, IconChevronLeft } from "justd-icons";
import { useState, useEffect, Fragment } from "react";
import { Card } from "~ui/card";
import { Heading } from "~ui/heading";
import { Button, buttonStyles } from "~ui/button";
import { Avatar } from "~ui/avatar";
import { Link } from "@tanstack/react-router";
import { chatMessagesQueryOptions } from "~lib/query-options";
import { Textarea } from "~ui/textarea";
import { supabase } from "~/lib/supabase"; // Assuming you have a Supabase client setup

export const Route = createFileRoute("/_main/messages/$chatId")({
	loader: ({ context, params }) => {
		const { chatId } = params;
		const { queryClient, session } = context;
		queryClient.ensureQueryData(
			chatMessagesQueryOptions(chatId, session.user.id),
		);
		return {
			crumb: "Chat",
			title: "Chat",
		};
	},
	component: MessagesChatId,
});

function MessagesChatId() {
	const { chatId } = Route.useParams();
	const { session } = Route.useRouteContext();
	const [newMessage, setNewMessage] = useState("");
	const queryClient = useQueryClient();
	const { data } = useSuspenseQuery(
		chatMessagesQueryOptions(chatId, session.user.id),
	);

	useEffect(() => {
		const channel = supabase
			.channel(`chat:${chatId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
					filter: `chat_id=eq.${chatId}`,
				},
				(payload) => {
					queryClient.setQueryData(
						chatMessagesQueryOptions(chatId, session.user.id).queryKey,
						(oldData: typeof data) => {
							if (!oldData) return oldData;
							// Check if the message already exists to prevent duplication
							const messageExists = oldData.messages.some(
								(msg) => msg.id === payload.new.id,
							);
							if (messageExists) return oldData;
							return {
								...oldData,
								messages: [...oldData.messages, payload.new],
							};
						},
					);
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [chatId, session.user.id, queryClient]);

	const handleSendMessage = async () => {
		if (newMessage.trim()) {
			try {
				const { data, error } = await supabase
					.from("messages")
					.insert({
						chat_id: chatId,
						senderId: session.user.id,
						content: newMessage,
					})
					.select();

				if (error) throw error;

				// Optimistically update the UI
				queryClient.setQueryData(
					chatMessagesQueryOptions(chatId, session.user.id).queryKey,
					(oldData: typeof data) => {
						if (!oldData) return oldData;
						return {
							...oldData,
							// @ts-expect-error - Assuming the data returned from the query is correct
							messages: [...oldData.messages, data[0]],
						};
					},
				);

				setNewMessage("");
			} catch (error) {
				console.error("Error sending message:", error);
				// Handle error (e.g., show a toast notification)
			}
		}
	};

	return (
		<div className="flex flex-col h-full">
			<Link
				to="/messages"
				className={buttonStyles({
					appearance: "outline",
					size: "extra-small",
					className: "w-fit mt-2",
				})}
			>
				<IconChevronLeft />
				Messages
			</Link>
			<Card.Header className="flex items-center gap-0 mb-0">
				<Avatar
					shape="circle"
					size="medium"
					src={`https://i.pravatar.cc/300?u=${data?.otherUser?.email}`}
				/>
				<Heading level={3} tracking="tight">
					{data?.otherUser?.name}
				</Heading>
			</Card.Header>
			<Card className="flex-grow overflow-y-auto mb-4">
				<div className="p-4 space-y-4">
					{data?.messages.map((message) => (
						<div key={message.id}>
							<div
								className={`flex mb-1 ${
									message.senderId === session.user.id
										? "justify-end"
										: "justify-start"
								}`}
							>
								<div
									className={`max-w-[70%] text-[13px] md:text-sm p-3 rounded-lg ${
										message.senderId === session.user.id
											? "bg-primary text-primary-fg"
											: "bg-secondary text-secondary-fg"
									}`}
								>
									{message.content}
								</div>
							</div>
							<p
								className={`text-[11px] sm:text-xs text-muted-fg ${message.senderId === session.user.id ? "text-end" : "text-start"}`}
							>
								{new Date(message.createdAt).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</p>
						</div>
					))}
				</div>
			</Card>
			<div className="flex gap-2 items-center">
				<Textarea
					className="flex-grow text-sm"
					rows={1}
					value={newMessage}
					onChange={(value) => setNewMessage(value)}
					placeholder="Type a message..."
					isRequired
				/>
				<Button size="small" onPress={handleSendMessage} intent="primary">
					<IconSend3 />
					Send
				</Button>
			</div>
		</div>
	);
}
