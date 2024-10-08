import {
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	IconCheck,
	IconChevronLeft,
	IconChevronRight,
	IconDotsVertical,
	IconHighlight,
	IconTrash,
} from "justd-icons";
import { useState } from "react";
import { z } from "zod";
import { userDonatedBooksQueryOptions } from "~lib/query-options";
import { Badge } from "~ui/badge";
import { Button, buttonStyles } from "~ui/button";
import { Card } from "~ui/card";
import { Heading } from "~ui/heading";
import { Menu } from "~ui/menu";
import { Select } from "~ui/select";
import { Table } from "~ui/table";
import { Skeleton } from "~ui/skeleton";
import { useMediaQuery } from "~ui/primitive";
import { Modal } from "~ui/modal";
import { TextField } from "~ui/text-field";
import { supabase } from "~lib/supabase";
import { toast } from "sonner";

const donationFilterSchema = z.object({
	status: z.enum(["donated", "notDonated", "all"]).default("all").catch("all"),
	page: z.number().positive().default(1).catch(1),
	pageSize: z.number().positive().default(10).catch(10),
});

function DonationsPending() {
	return (
		<div>
			<div className="mb-6 mt-2">
				<Skeleton className="h-8 w-40 mb-2" />
				<Skeleton className="h-4 w-full max-w-md" />
			</div>
			<div className="flex justify-end mb-4">
				<Skeleton className="w-40 h-10" />
			</div>
			<Card>
				<Skeleton className="w-full h-[400px]" />
			</Card>
			<div className="mt-4 flex justify-between items-center">
				<Button intent="secondary" size="extra-small" isDisabled>
					<IconChevronLeft />
					Prev
				</Button>
				<Skeleton className="w-20 h-4" />
				<Button intent="secondary" size="extra-small" isDisabled>
					Next
					<IconChevronRight />
				</Button>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/_main/donations/")({
	pendingComponent: DonationsPending,
	validateSearch: donationFilterSchema,
	loaderDeps: ({ search: { page, pageSize, status } }) => ({
		page,
		pageSize,
		status,
	}),
	loader: ({ context, deps: { page, pageSize, status } }) => {
		context.queryClient.ensureQueryData(
			userDonatedBooksQueryOptions(
				context.session.user.id,
				page,
				pageSize,
				status,
			),
		);
		return {
			crumb: "Donations",
			title: "Donations",
			search: {
				page,
				pageSize,
				status,
			},
			username: context.session.user.user_metadata.username as string,
		};
	},
	component: Donations,
});

const filterOptions = [
	{ value: "all", label: "All" },
	{ value: "donated", label: "Donated" },
	{ value: "notDonated", label: "Not Donated" },
];

function Donations() {
	const queryClient = useQueryClient();
	const [recipientUsername, setRecipientUsername] = useState("");
	const isMobile = useMediaQuery("(max-width: 600px)");
	const { search } = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const {
		session: {
			user: { id },
		},
	} = Route.useRouteContext();
	const { username } = Route.useLoaderData();
	const {
		data: books,
		isLoading,
		error,
	} = useQuery(
		userDonatedBooksQueryOptions(
			id,
			search.page,
			search.pageSize,
			search.status,
		),
	);

	const [selectedBook, setSelectedBook] = useState<{
		id: string;
		title: string;
	} | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { mutateAsync: markAsDonated, isPending } = useMutation({
		mutationKey: ["markAsDonated"],
		mutationFn: async ({
			bookId,
			recipientUsername,
		}: { bookId: string; recipientUsername: string }) => {
			const { data, error } = await supabase.rpc("mark_book_as_donated", {
				book_id: bookId,
				recipient_username: recipientUsername,
				donor_username: username,
			});

			if (error) {
				throw error;
			}

			return {};
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user-donated-books"] });
			queryClient.invalidateQueries({ queryKey: ["total-donations"] });
			queryClient.invalidateQueries({ queryKey: ["listed-not-donated-books"] });
			queryClient.invalidateQueries({ queryKey: ["book-filters"] });
		},
	});

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingBook, setEditingBook] = useState<{
		id: string;
		title: string;
		author: string;
		description: string;
	} | null>(null);

	const { mutateAsync: updateBook, isPending: isUpdating } = useMutation({
		mutationKey: ["updateBook"],
		mutationFn: async ({
			bookId,
			title,
			author,
			description,
		}: {
			bookId: string;
			title: string;
			author: string;
			description: string;
		}) => {
			const { data, error } = await supabase
				.from("books")
				.update({ title, author, description })
				.eq("id", bookId);

			if (error) {
				throw error;
			}

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user-donated-books"] });
		},
	});

	if (isLoading) return <DonationsPending />;

	if (error) return <div>Error: {error.message}</div>;

	return (
		<div>
			<div className="mb-6 mt-2">
				<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
					<div>
						<Heading level={2} tracking="tight">
							Donations
						</Heading>
						<p className="text-xs md:text-sm text-muted-fg">
							This is the page where you can see all the books you've listed for
							donation and donated.
						</p>
					</div>
					<Link
						to="/donations/new"
						className={buttonStyles({
							size: isMobile ? "extra-small" : "small",
						})}
					>
						Add New Book
					</Link>
				</div>
			</div>
			<div className="flex justify-end mb-4">
				<Select
					defaultSelectedKey={search.status}
					onSelectionChange={(selectedKey) => {
						navigate({
							search: (prev) => ({
								...prev,
								status: selectedKey as "all" | "donated" | "notDonated",
							}),
						});
					}}
					className="w-40"
					placeholder="Filter by status"
				>
					<Select.Trigger />
					<Select.List items={filterOptions}>
						{(item) => (
							<Select.Option
								className="text-sm"
								id={item.value}
								textValue={item.label}
							>
								{item.label}
							</Select.Option>
						)}
					</Select.List>
				</Select>
			</div>
			<Card>
				<Table>
					<Table.Header>
						<Table.Column isRowHeader>Title</Table.Column>
						<Table.Column>Author</Table.Column>
						<Table.Column>Description</Table.Column>
						<Table.Column>Status</Table.Column>
						<Table.Column>Listed At</Table.Column>
						<Table.Column />
					</Table.Header>
					<Table.Body
						renderEmptyState={() => (
							<div className="text-center py-4 font-medium text-pretty">
								{search.status === "all"
									? "You currently have no books available for donation."
									: search.status === "donated"
										? "You currently have no donated books."
										: "You currently have no not donated books."}
							</div>
						)}
						items={books ? books.books : []}
					>
						{(book) => (
							<Table.Row id={book.id}>
								<Table.Cell className="capitalize">{book.title}</Table.Cell>
								<Table.Cell>{book.author}</Table.Cell>
								<Table.Cell>
									{book.description && book.description.length > 50
										? `${book.description.slice(0, 50)}...`
										: book.description || "No description available"}
								</Table.Cell>
								<Table.Cell>
									<Badge intent={book.isDonated ? "success" : "primary"}>
										{book.isDonated ? "Donated" : "Not Donated"}
									</Badge>
								</Table.Cell>
								<Table.Cell>
									{new Date(book.createdAt).toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</Table.Cell>
								<Table.Cell>
									<div className="flex justify-end">
										<Menu>
											<Menu.Trigger>
												<IconDotsVertical />
											</Menu.Trigger>
											<Menu.Content
												className="min-w-[180px]"
												respectScreen={false}
												placement="bottom end"
											>
												<Menu.Item
													className="text-xs"
													isDisabled={book.isDonated}
													onAction={() => {
														setEditingBook({
															id: book.id,
															title: book.title,
															author: book.author,
															description: book.description || "",
														});
														setIsEditModalOpen(true);
													}}
												>
													<IconHighlight />
													Edit Book Details
												</Menu.Item>
												<Menu.Item
													className="text-xs"
													isDisabled={book.isDonated}
													onAction={() => {
														setSelectedBook({ id: book.id, title: book.title });
														setIsModalOpen(true);
													}}
												>
													<IconCheck />
													Mark as Donated
												</Menu.Item>
											</Menu.Content>
										</Menu>
									</div>
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
			</Card>
			<div className="mt-4 flex justify-between items-center">
				<Button
					intent="secondary"
					size="extra-small"
					isDisabled={search.page <= 1}
					onPress={() =>
						navigate({ search: (prev) => ({ ...prev, page: prev.page - 1 }) })
					}
				>
					<IconChevronLeft />
					Prev
				</Button>
				<div className="text-center text-xs sm:text-sm text-muted-fg">
					Page {search.page} of{" "}
					{Math.ceil((books?.totalCount ?? 0) / (books?.pageSize ?? 10))}
				</div>
				<Button
					intent="secondary"
					size="extra-small"
					isDisabled={
						!books ||
						search.page >= Math.ceil(books.totalCount / books.pageSize)
					}
					onPress={() =>
						navigate({ search: (prev) => ({ ...prev, page: prev.page + 1 }) })
					}
				>
					Next
					<IconChevronRight />
				</Button>
			</div>
			<Modal>
				{selectedBook && (
					<Modal.Content isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
						<Modal.Header>
							<Modal.Title>Mark Book as Donated</Modal.Title>
							<Modal.Description>
								Enter the recipient's username. This action is irreversible.
							</Modal.Description>
						</Modal.Header>
						<form>
							<div className="space-y-4">
								<TextField
									label="Book Title"
									value={selectedBook?.title || ""}
									isReadOnly
								/>
								<TextField
									label="Recipient's Username"
									placeholder="@stephen_curry"
									description="So we can send them a notification"
									descriptionClassName="text-sm text-muted-fg"
									value={recipientUsername}
									onChange={(value) => setRecipientUsername(value)}
								/>
							</div>
							<Modal.Footer className="flex justify-end gap-2 mt-2 flex-col">
								<Modal.Close
									intent="secondary"
									size="small"
									onPress={() => setIsModalOpen(false)}
								>
									Cancel
								</Modal.Close>
								<Button
									onPress={() => {
										if (!selectedBook?.id || !recipientUsername) return;
										toast.promise(
											markAsDonated({
												bookId: selectedBook.id,
												recipientUsername: recipientUsername
													.trim()
													.toLowerCase(),
											}),
											{
												loading: "Marking as donated...",
												success: "Book marked as donated!",
												error: (error) => error.message,
											},
										);
										setIsModalOpen(false);
									}}
									size="small"
								>
									{isPending ? "Confirming..." : "Confirm Donation"}
								</Button>
							</Modal.Footer>
						</form>
					</Modal.Content>
				)}
			</Modal>

			{/* Edit Book Modal */}
			<Modal>
				{editingBook && (
					<Modal.Content
						isOpen={isEditModalOpen}
						onOpenChange={setIsEditModalOpen}
					>
						<Modal.Header>
							<Modal.Title>Edit Book Details</Modal.Title>
							<Modal.Description>
								Update the details of your book listing.
							</Modal.Description>
						</Modal.Header>
						<form onSubmit={(e) => e.preventDefault()}>
							<div className="space-y-4">
								<TextField
									label="Book Title"
									value={editingBook.title}
									onChange={(value) =>
										setEditingBook({ ...editingBook, title: value })
									}
								/>
								<TextField
									label="Author"
									value={editingBook.author}
									onChange={(value) =>
										setEditingBook({ ...editingBook, author: value })
									}
								/>
								<TextField
									label="Description"
									value={editingBook.description}
									onChange={(value) =>
										setEditingBook({ ...editingBook, description: value })
									}
								/>
							</div>
							<Modal.Footer className="flex justify-end gap-2 mt-2 flex-col">
								<Modal.Close
									intent="secondary"
									size="small"
									onPress={() => setIsEditModalOpen(false)}
								>
									Cancel
								</Modal.Close>
								<Button
									onPress={() => {
										if (!editingBook) return;
										toast.promise(
											updateBook({
												bookId: editingBook.id,
												title: editingBook.title,
												author: editingBook.author,
												description: editingBook.description,
											}),
											{
												loading: "Updating book details...",
												success: "Book details updated successfully!",
												error: (error) => error.message,
											},
										);
										setIsEditModalOpen(false);
									}}
									size="small"
								>
									Update Book
								</Button>
							</Modal.Footer>
						</form>
					</Modal.Content>
				)}
			</Modal>
		</div>
	);
}
