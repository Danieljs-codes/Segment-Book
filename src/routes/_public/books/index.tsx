import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { IconPlus } from "justd-icons";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
	bookFiltersQueryOptions,
	bookByIdQueryOptions,
} from "~lib/query-options";
import { Badge } from "~ui/badge";
import { Button } from "~ui/button";
import { Card } from "~ui/card";
import { Heading } from "~ui/heading";
import { Modal } from "~ui/modal";
import { cn } from "~ui/primitive";
import { SearchField } from "~ui/search-field";
import { Select } from "~ui/select";

const bookSearchParamsSchema = z.object({
	bookId: z.string().optional(),
});

export const Route = createFileRoute("/_public/books/")({
	validateSearch: bookSearchParamsSchema,
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(bookFiltersQueryOptions());
		return {
			userId: context.auth.session?.user.id,
		};
	},
	component: Books,
});

function getBadgeIntent(condition: string) {
	switch (condition) {
		case "like_new":
			return "primary";
		case "excellent":
			return "success";
		case "good":
			return "info";
		case "fair":
			return "warning";
		case "acceptable":
			return "danger";
		default:
			return "primary";
	}
}

function Books() {
	const { data: bookFilters } = useSuspenseQuery(bookFiltersQueryOptions());
	const { userId } = Route.useLoaderData();
	const { bookId } = Route.useSearch();

	const { data: selectedBook } = useQuery(bookByIdQueryOptions(bookId ?? ""));

	const navigate = Route.useNavigate();
	return (
		<div className="space-y-4">
			<Heading className="mb-4" level={2} tracking="tight">
				Books Available for Donation
			</Heading>
			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-2">
				<SearchField
					aria-label="Search books"
					placeholder="Search books"
					className="w-full"
				/>
				<div className="flex w-full sm:w-auto gap-2">
					<Select
						defaultSelectedKey={"all_conditions"}
						placeholder="Filter by condition"
						className="w-full sm:w-[180px]"
						aria-label="Filter by condition"
					>
						<Select.Trigger className="w-full" />
						<Select.List
							items={[
								{ id: "all_conditions", name: "All Conditions" },
								{ id: "like_new", name: "Like New" },
								{ id: "excellent", name: "Excellent" },
								{ id: "good", name: "Good" },
								{ id: "fair", name: "Fair" },
								{ id: "acceptable", name: "Acceptable" },
							]}
							className="min-w-[--trigger-width]"
						>
							{(item) => (
								<Select.Option
									className="text-sm"
									id={item.id}
									textValue={item.name}
								>
									{item.name}
								</Select.Option>
							)}
						</Select.List>
					</Select>
					<Button
						onPress={() => {
							if (!userId) {
								toast.error("You must be signed in to add a book.");
								return;
							}

							navigate({
								to: "/donations",
								search: {
									status: "all",
									page: 1,
									pageSize: 10,
								},
							});
						}}
						intent="primary"
						className="whitespace-nowrap text-sm"
					>
						<IconPlus />
						Add Book
					</Button>
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{bookFilters.map((book) => (
					<Link
						to="/books"
						search={{
							bookId: book.id,
						}}
						key={book.id}
					>
						<Card className="overflow-hidden">
							<Card.Header withoutPadding className="py-3">
								<img
									src="https://placehold.co/400x200"
									alt="Book cover placeholder"
									className="w-full h-auto object-cover"
								/>
							</Card.Header>
							<Card.Content className="px-4 pb-4">
								<div>
									<div className="flex items-center gap-x-2 justify-between">
										<h2 className="text-base font-semibold">{book.title}</h2>
										<Badge
											className="capitalize"
											intent={getBadgeIntent(book.condition)}
										>
											{book.condition}
										</Badge>
									</div>
									<p className="text-sm text-muted-fg mb-2">{book.author}</p>
									<p className="text-xs text-muted-fg">
										<span className="font-medium text-fg">Listed on:</span>{" "}
										{new Date(book.createdAt).toLocaleDateString("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</p>
									<p className="text-xs text-muted-fg mt-1">
										<span className="font-medium text-fg">Listed by:</span>{" "}
										{book.donor?.name}
									</p>
								</div>
							</Card.Content>
						</Card>
					</Link>
				))}
			</div>
			<Modal>
				{selectedBook && (
					<Modal.Content
						// role="alertdialog"
						isOpen={!!bookId}
						onOpenChange={() =>
							navigate({ search: (prev) => ({ ...prev, bookId: undefined }) })
						}
					>
						<Modal.Header>
							<Modal.Title>{selectedBook.title}</Modal.Title>
							<Modal.Description>by {selectedBook.author}</Modal.Description>
						</Modal.Header>
						<Modal.Body>
							<div className="grid gap"></div>
						</Modal.Body>
						<Modal.Footer>
							<Modal.Close size="extra-small">Close</Modal.Close>
						</Modal.Footer>
					</Modal.Content>
				)}
			</Modal>
		</div>
	);
}
