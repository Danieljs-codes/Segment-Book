import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	IconCheck,
	IconDotsVertical,
	IconHighlight,
	IconTrash,
} from "justd-icons";
import { z } from "zod";
import { userDonatedBooksQueryOptions } from "~lib/query-options";
import { Badge } from "~ui/badge";
import { Card } from "~ui/card";
import { Heading } from "~ui/heading";
import { Menu } from "~ui/menu";
import { Select } from "~ui/select";
import { Table } from "~ui/table";

const donationFilterSchema = z.object({
	status: z.enum(["donated", "notDonated", "all"]).default("all").catch("all"),
	page: z.number().positive().default(1).catch(1),
	pageSize: z.number().positive().default(10).catch(10),
});

export const Route = createFileRoute("/_main/donations")({
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
	const {
		session: {
			user: { id },
		},
	} = Route.useRouteContext();
	const { data: books } = useSuspenseQuery(
		userDonatedBooksQueryOptions(
			id,
			search.page,
			search.pageSize,
			search.status,
		),
	);
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
						<Table.Column>Listed At</Table.Column>
						<Table.Column>Status</Table.Column>
						<Table.Column />
					</Table.Header>
					<Table.Body
						renderEmptyState={() => (
							<div className="text-center py-4 font-medium text-pretty">
								You currently have no books available for donation.
							</div>
						)}
						items={books.books}
					>
						{(book) => (
							<Table.Row id={book.id}>
								<Table.Cell>{book.title}</Table.Cell>
								<Table.Cell>{book.author}</Table.Cell>
								<Table.Cell>{book.description}</Table.Cell>
								<Table.Cell>
									{new Date(book.createdAt).toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</Table.Cell>
								<Table.Cell>
									<Badge intent={book.isDonated ? "success" : "primary"}>
										{book.isDonated ? "Donated" : "Not Donated"}
									</Badge>
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
												<Menu.Item className="text-xs" isDanger>
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
		</div>
	);
}
