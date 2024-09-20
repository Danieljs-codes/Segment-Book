import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IconSend3, IconChevronLeft } from "justd-icons";
import { useState } from "react";
import { Card } from "~ui/card";
import { Heading } from "~ui/heading";
import { Button, buttonStyles } from "~ui/button";
import { Avatar } from "~ui/avatar";
import { TextField } from "~ui/text-field";
import { Link } from "@tanstack/react-router";
import { chatMessagesQueryOptions } from "~lib/query-options";
import { Textarea } from "~ui/textarea";

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
	const { data } = useSuspenseQuery(
		chatMessagesQueryOptions(chatId, session.user.id),
	);
	// const { mutate: sendMessage } = sendMessageMutation();

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			// sendMessage({ chatId, userId: session.user.id, content: newMessage });
			setNewMessage("");
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
						<div
							key={message.id}
							className={`flex ${
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
				/>
				<Button size="small" onPress={handleSendMessage} intent="primary">
					<IconSend3 />
					Send
				</Button>
			</div>
		</div>
	);
}
