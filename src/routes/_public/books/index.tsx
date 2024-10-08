import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	IconBookOpen,
	IconCalendar,
	IconContacts,
	IconGlobe,
	IconPlus,
	IconPriceTag,
} from "justd-icons";
import { useState } from "react";
import { toast } from "sonner";
import {
	bookFiltersQueryOptions,
	bookByIdQueryOptions,
} from "~lib/query-options";
import { supabase } from "~lib/supabase";
import { Badge } from "~ui/badge";
import { Button } from "~ui/button";
import { Card } from "~ui/card";
import { Heading } from "~ui/heading";
import { Modal } from "~ui/modal";
import { SearchField } from "~ui/search-field";
import { Select } from "~ui/select";
import { useAuth } from "~lib/auth";
import { EmptyState } from "~components/empty-state";

export const Route = createFileRoute("/_public/books/")({
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
			return "secondary";
		default:
			return "primary";
	}
}

function Books() {
	const { data: bookFilters } = useSuspenseQuery(bookFiltersQueryOptions());
	const { userId } = Route.useLoaderData();
	const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

	const {
		data: selectedBook,
		isFetching,
		error,
	} = useQuery(bookByIdQueryOptions(selectedBookId ?? ""));

	const { mutate: requestBook, isPending: isRequesting } = useMutation({
		mutationFn: async () => {
			if (!selectedBookId || !userId || !selectedBook?.donor?.id) {
				throw new Error("Missing book ID or user ID");
			}
			const { data, error } = await supabase.rpc("request_book", {
				book_id: selectedBookId,
				donor_id: selectedBook.donor.id,
				requester_id: userId,
			});
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			toast.success("Book requested successfully");
			setSelectedBookId(null);
		},
		onError: (error) => {
			toast.error(`Error: ${error.message}`);
		},
	});

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
								to: "/donations/new",
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
			{bookFilters.length === 0 ? (
				<div className="pt-4">
					<EmptyState
						icon={IconBookOpen}
						title="No books available"
						description={
							<p className="sm:max-w-[500px]">
								There are currently no books available for donation. Check back
								later or add a book yourself!
							</p>
						}
					>
						<Button
							onPress={() => {
								if (!userId) {
									toast.error("You must be signed in to add a book.");
									return;
								}
								navigate({ to: "/donations/new" });
							}}
							intent="primary"
							size="small"
						>
							Add a Book
						</Button>
					</EmptyState>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{bookFilters.map((book) => (
						<Card
							key={book.id}
							className="overflow-hidden cursor-pointer"
							onClick={() => setSelectedBookId(book.id)}
						>
							<Card.Header withoutPadding className="py-3">
								<img
									src={book.image_url}
									alt="Book cover placeholder"
									className="w-full h-[200px] object-contain bg-border"
								/>
							</Card.Header>
							<Card.Content className="px-4 pb-4">
								<div>
									<div className="flex items-center gap-x-2 justify-between">
										<h2 className="text-base font-semibold select-none">
											{book.title}
										</h2>
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
					))}
				</div>
			)}
			<Modal
				isOpen={!!selectedBookId}
				onOpenChange={(isOpen) => {
					if (!isOpen) setSelectedBookId(null);
				}}
			>
				{!isFetching && !error && selectedBook && (
					<Modal.Content isBlurred size="3xl">
						<Modal.Header>
							<Modal.Title>{selectedBook?.title}</Modal.Title>
							<Modal.Description>by {selectedBook?.author}</Modal.Description>
						</Modal.Header>
						<Modal.Body>
							<div className="flex flex-col md:flex-row gap-4">
								<div className="rounded-lg overflow-hidden flex-1">
									<img
										src={selectedBook.image_url}
										alt="Book cover"
										className="w-full h-[200px] object-contain bg-border"
									/>
								</div>
								<div className="flex-1">
									<h3 className="text-muted-fg text-sm ">
										{selectedBook?.description}
									</h3>
									<div className="grid grid-cols-2 gap-2 mt-4">
										<Badge shape="circle" className="w-fit capitalize">
											<IconBookOpen />
											{selectedBook?.condition}
										</Badge>
										<Badge shape="circle" className="w-fit capitalize">
											<IconGlobe />
											{selectedBook?.language}
										</Badge>
										<Badge shape="circle" className="w-fit capitalize">
											<IconCalendar />
											{selectedBook?.createdAt &&
												new Date(selectedBook.createdAt).toLocaleDateString(
													"en-US",
													{ year: "numeric", month: "short", day: "numeric" },
												)}
										</Badge>
										<Badge shape="circle" className="w-fit capitalize">
											<IconContacts />
											{selectedBook?.donor?.name}
										</Badge>
									</div>
									<div className="mt-2">
										<p className="text-muted-fg text-sm mb-1">Categories:</p>
										<div className="flex gap-2 items-center flex-wrap">
											{selectedBook?.book_categories.map((bookCategory) => (
												<Badge
													key={bookCategory.category?.id}
													className="w-fit capitalize"
												>
													<IconPriceTag />
													{bookCategory.category?.name}
												</Badge>
											))}
										</div>
									</div>
								</div>
							</div>
						</Modal.Body>
						<Modal.Footer>
							<Button
								onPress={() => {
									if (!userId) {
										toast.error("Please login to request a book");
										return;
									}
									requestBook();
								}}
								size="small"
								isDisabled={isRequesting}
							>
								{isRequesting ? "Requesting..." : "Request Book"}
							</Button>
						</Modal.Footer>
					</Modal.Content>
				)}
			</Modal>
		</div>
	);
}
