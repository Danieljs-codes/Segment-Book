import { createFileRoute } from "@tanstack/react-router";
import { IconSend3, IconChevronLeft, IconLoader } from "justd-icons";
import { Card } from "~ui/card";
import { Heading } from "~ui/heading";
import { Button, buttonStyles } from "~ui/button";
import { Avatar } from "~ui/avatar";
import { Link } from "@tanstack/react-router";
import { Textarea } from "~ui/textarea";
import {
	chatMessagesQueryOptions,
	getChatParticipantsQueryOptions,
} from "~lib/query-options";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { supabase } from "~lib/supabase";

export const Route = createFileRoute("/_main/messages/$chatId")({
	loader: ({ context: { queryClient, session }, params: { chatId } }) => {
		const userId = session.user.id;
		queryClient.ensureQueryData(chatMessagesQueryOptions(chatId));
		queryClient.ensureQueryData(
			getChatParticipantsQueryOptions(chatId, userId),
		);
		return {
			crumb: "Message",
			userId,
		};
	},
	component: MessagesChatId,
});

function MessagesChatId() {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [message, setMessage] = useState("");
	const [isSending, setIsSending] = useState(false);
	const queryClient = useQueryClient();
	const { chatId } = Route.useParams();
	const { userId } = Route.useLoaderData();
	const { data: participants } = useSuspenseQuery(
		getChatParticipantsQueryOptions(chatId, userId),
	);
	const { data: messages } = useSuspenseQuery(chatMessagesQueryOptions(chatId));

	const adjustHeight = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run on mount
	useEffect(() => {
		adjustHeight();
	}, []);

	useEffect(() => {
		window.scrollTo({
			top: document.body.scrollHeight,
			behavior: "smooth",
		});
	}, []);

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
					queryClient.invalidateQueries(chatMessagesQueryOptions(chatId));
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [chatId, queryClient]);

	const sendMessage = async () => {
		setIsSending(true);
		if (!message.trim()) return;

		const { error } = await supabase.from("messages").insert({
			content: message,
			chat_id: chatId,
			senderId: userId,
		});

		if (error) {
			console.error("Error sending message:", error);
		} else {
			setMessage("");
			adjustHeight();
		}
		setIsSending(false);
	};

	const handleInput = (value: string) => {
		adjustHeight();
		setMessage(value);
	};

	// TODO: Implement sending message

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
					src="https://i.pravatar.cc/300?u=user2"
				/>
				<div>
					<Heading className="text-center" level={3} tracking="tight">
						{participants[0].other_user_name}
					</Heading>
					<p className="text-sm text-muted-fg text-center">
						@{participants[0].other_user_username}
					</p>
				</div>
			</Card.Header>
			<Card className="flex-grow overflow-y-auto mb-4">
				<div className="p-4 space-y-4">
					{messages.map((message) => (
						<div key={message.message_id}>
							<div
								className={`flex mb-1 ${
									message.sender_id === userId ? "justify-end" : "justify-start"
								}`}
							>
								<div
									className={`max-w-[70%] text-[13px] md:text-sm p-3 rounded-lg ${
										message.sender_id === userId
											? "bg-primary text-primary-fg"
											: "bg-secondary text-secondary-fg"
									}`}
								>
									{message.content}
								</div>
							</div>
							<p
								className={`text-[11px] sm:text-xs text-muted-fg ${message.sender_id === userId ? "text-end" : "text-start"}`}
							>
								{message.sender_id === userId
									? "You"
									: participants[0].other_user_name}{" "}
								•{" "}
								{new Date(message.message_created_at).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</p>
						</div>
					))}
				</div>
			</Card>
			<div className="flex gap-2 items-end">
				<Textarea
					className="flex-grow text-sm"
					rows={2}
					value={message}
					onChange={handleInput}
					placeholder="Type a message..."
					isRequired
					ref={textareaRef}
					aria-label="Message Box"
					isDisabled={isSending}
				/>
				<Button size="small" intent="primary" onPress={sendMessage}>
					{isSending ? <IconLoader className="animate-spin" /> : <IconSend3 />}
					Send
				</Button>
			</div>
		</div>
	);
}
