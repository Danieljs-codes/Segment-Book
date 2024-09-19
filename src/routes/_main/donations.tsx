import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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
import { Button } from "~ui/button";
import { Card } from "~ui/card";
import { Heading } from "~ui/heading";
import { Menu } from "~ui/menu";
import { Select } from "~ui/select";
import { Table } from "~ui/table";
import { Skeleton } from "~ui/skeleton";

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

export const Route = createFileRoute("/_main/donations")({
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
	const { search } = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const {
		session: {
			user: { id },
		},
	} = Route.useRouteContext();
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

	if (isLoading) return <DonationsPending />;

	if (error) return <div>Error: {error.message}</div>;

	return (
		<div>
			<div className="mb-6 mt-2">
				<Heading level={2} tracking="tight">
					Donations
				</Heading>
				<p className="text-xs md:text-sm text-muted-fg">
					This is the page where you can see all the books you've listed for
					donation and donated.
				</p>
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
								<Table.Cell>{book.title}</Table.Cell>
								<Table.Cell>{book.author}</Table.Cell>
								<Table.Cell>{book.description}</Table.Cell>
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
												respectScreen={false}
												placement="bottom end"
											>
												<Menu.Item className="text-xs">
													<IconHighlight />
													Edit Book Details
												</Menu.Item>
												<Menu.Item className="text-xs">
													<IconCheck />
													Mark as Donated
												</Menu.Item>
												<Menu.Item
													isDisabled={book.isDonated}
													className="text-xs"
													isDanger
												>
													<IconTrash />
													Delete Book
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
		</div>
	);
}
