import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	IconChevronLeft,
	IconChevronRight,
	IconDotsVertical,
	IconHighlight,
	IconTrash,
} from "justd-icons";
import { z } from "zod";
import { userRequestsQueryOptions } from "~lib/query-options";
import { Badge } from "~ui/badge";
import { Button } from "~ui/button";
import { Card } from "~ui/card";
import { Heading } from "~ui/heading";
import { Menu } from "~ui/menu";
import { Select } from "~ui/select";
import { Table } from "~ui/table";
import { Skeleton } from "~ui/skeleton";

const requestFilterSchema = z.object({
	status: z.enum(["all", "accepted", "declined"]).default("all").catch("all"),
	page: z.number().positive().default(1).catch(1),
	pageSize: z.number().positive().default(10).catch(10),
});

function RequestsPending() {
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

export const Route = createFileRoute("/_main/requests")({
	pendingComponent: RequestsPending,
	validateSearch: requestFilterSchema,
	loaderDeps: ({ search: { page, pageSize, status } }) => ({
		page,
		pageSize,
		status,
	}),
	loader: ({ context, deps: { page, pageSize, status } }) => {
		context.queryClient.ensureQueryData(
			userRequestsQueryOptions(context.session.user.id, page, pageSize, status),
		);
		return {
			crumb: "Requests",
			title: "Requests",
			search: {
				page,
				pageSize,
				status,
			},
		};
	},
	component: Requests,
});

const filterOptions = [
	{ value: "all", label: "All" },
	{ value: "accepted", label: "Accepted" },
	{ value: "declined", label: "Declined" },
];

function Requests() {
	const { search } = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const {
		session: {
			user: { id },
		},
	} = Route.useRouteContext();
	const {
		data: requests,
		isLoading,
		error,
	} = useQuery(
		userRequestsQueryOptions(id, search.page, search.pageSize, search.status),
	);

	if (isLoading) return <RequestsPending />;

	if (error) return <div>Error: {error.message}</div>;

	return (
		<div>
			<div className="mb-6 mt-2">
				<Heading level={2} tracking="tight">
					Requests
				</Heading>
				<p className="text-xs md:text-sm text-muted-fg mt-1">
					This is the page where you can see all the requests you've made for
					books.
				</p>
			</div>
			<div className="flex justify-end mb-4">
				<Select
					defaultSelectedKey={search.status}
					onSelectionChange={(selectedKey) => {
						navigate({
							search: (prev) => ({
								...prev,
								status: selectedKey as "all" | "accepted" | "declined",
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
						<Table.Column isRowHeader>Book Title</Table.Column>
						<Table.Column>Author</Table.Column>
						<Table.Column>Donor</Table.Column>
						<Table.Column>Status</Table.Column>
						<Table.Column>Requested At</Table.Column>
						<Table.Column />
					</Table.Header>
					<Table.Body
						renderEmptyState={() => (
							<div className="text-center py-4 font-medium text-pretty">
								{search.status === "all"
									? "You currently have no requests."
									: search.status === "accepted"
										? "You currently have no accepted requests."
										: "You currently have no declined requests."}
							</div>
						)}
						items={requests ? requests.requests : []}
					>
						{(request) => (
							<Table.Row id={request.id}>
								<Table.Cell>{request.book_title}</Table.Cell>
								<Table.Cell>{request.book_author}</Table.Cell>
								<Table.Cell>{request.donor_name}</Table.Cell>
								<Table.Cell>
									<Badge
										className="capitalize"
										intent={
											request.status === "ACCEPTED"
												? "success"
												: request.status === "REJECTED"
													? "danger"
													: "warning"
										}
									>
										{request.status.toLowerCase()}
									</Badge>
								</Table.Cell>
								<Table.Cell>
									{new Date(request.created_at).toLocaleDateString("en-US", {
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
													View Details
												</Menu.Item>
												<Menu.Item
													isDisabled={request.status !== "PENDING"}
													className="text-xs"
													isDanger
												>
													<IconTrash />
													Cancel Request
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
					{Math.ceil((requests?.totalCount ?? 0) / (requests?.pageSize ?? 10))}
				</div>
				<Button
					intent="secondary"
					size="extra-small"
					isDisabled={
						!requests ||
						search.page >= Math.ceil(requests.totalCount / requests.pageSize)
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
