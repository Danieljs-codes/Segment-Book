import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	IconBook,
	IconCheck,
	IconDotsVertical,
	IconHighlight,
	IconTrash,
} from "justd-icons";
import {
	totalDonationsQueryOptions,
	booksReceivedQueryOptions,
	activeRequestsReceivedQueryOptions,
	activeRequestsSentQueryOptions,
	listedButNotDonatedBooksQueryOptions,
	bookListedButNotDonatedQueryOptions,
} from "~lib/query-options";
import { Button } from "~ui/button";
import { Card } from "~ui/card";
import { Grid } from "~ui/grid";
import { Heading } from "~ui/heading";
import { Menu } from "~ui/menu";
import { Table } from "~ui/table";

export const Route = createFileRoute("/_main/dashboard")({
	loader: async ({ context }) => {
		const { session, queryClient } = context;
		const userId = session.user.id;

		// This is to trigger the fetch early it is going to start fetching but not wait for the data before it starts rendering since we are not awaiting it (Note: Since we are using useSuspenseQuery it still going to wait for the data to be fetched)
		queryClient.ensureQueryData(totalDonationsQueryOptions(userId));
		queryClient.ensureQueryData(booksReceivedQueryOptions(userId));
		queryClient.ensureQueryData(activeRequestsReceivedQueryOptions(userId));
		queryClient.ensureQueryData(activeRequestsSentQueryOptions(userId));
		queryClient.ensureQueryData(listedButNotDonatedBooksQueryOptions(userId));
		queryClient.ensureQueryData(bookListedButNotDonatedQueryOptions(userId));

		return {
			crumb: "Overview",
			title: `Welcome back, ${session?.user?.user_metadata?.full_name
				?.split(" ")
				.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ")}`,
			userId,
		};
	},
	pendingComponent: () => <div>Loading...</div>,
	component: OverviewComponent,
});

function OverviewComponent() {
	const { userId } = Route.useLoaderData();
	const { data: totalDonatedBooks } = useSuspenseQuery(
		totalDonationsQueryOptions(userId),
	);
	const { data: booksReceived } = useSuspenseQuery(
		booksReceivedQueryOptions(userId),
	);
	const { data: activeRequestsReceived } = useSuspenseQuery(
		activeRequestsReceivedQueryOptions(userId),
	);
	const { data: activeRequestsSent } = useSuspenseQuery(
		activeRequestsSentQueryOptions(userId),
	);
	const { data: listedButNotDonatedBooks } = useSuspenseQuery(
		listedButNotDonatedBooksQueryOptions(userId),
	);
	const { data: bookListedButNotDonated } = useSuspenseQuery(
		bookListedButNotDonatedQueryOptions(userId),
	);

	return (
		<div>
			<Heading className="mb-4" level={2} tracking="tight">
				Overview
			</Heading>
			<div className="mb-6">
				<Grid
					className="divide-y lg:divide-y-0 lg:divide-x lg:border-x"
					columns={{ initial: 1, lg: 4 }}
				>
					<Card className="border-y-0 shadow-none border-x-0 rounded-none py-4 lg:px-6">
						<Card.Header
							className="p-0"
							title={`${totalDonatedBooks}`}
							description="Books you've donated"
							descriptionClassName="text-sm"
						/>
					</Card>
					<Card className="border-y-0 shadow-none border-x-0 rounded-none py-4 lg:px-6">
						<Card.Header
							className="p-0"
							title={`${booksReceived.length}`}
							description="Books you've received"
							descriptionClassName="text-sm"
						/>
					</Card>
					<Card className="border-y-0 shadow-none border-x-0 rounded-none py-4 lg:px-6">
						<Card.Header
							className="p-0"
							title={`${bookListedButNotDonated.length}`}
							description="Books you've listed but haven't been donated yet"
							descriptionClassName="text-sm"
						/>
					</Card>
					<Card className="border-y-0 shadow-none border-x-0 rounded-none py-4 lg:px-6">
						<Card.Header
							className="p-0"
							title={`${activeRequestsReceived.length}`}
							description="Donation requests you've received"
							descriptionClassName="text-sm"
						/>
					</Card>
				</Grid>
			</div>
			<div className="mb-6">
				<Card.Header
					className="px-0 pt-0 space-y-0.5"
					title="Books Available for Donation"
					titleClassName="text-base md:text-lg"
					description="Your recently listed books but haven't been donated yet"
					descriptionClassName="text-sm"
				/>
				<Card>
					<Table aria-label="Books Available for Donation">
						<Table.Header>
							<Table.Column isRowHeader>Title</Table.Column>
							<Table.Column>Author</Table.Column>
							<Table.Column>Description</Table.Column>
							<Table.Column />
						</Table.Header>
						<Table.Body
							renderEmptyState={() => (
								<div className="text-center py-4 font-medium text-pretty">
									You currently have no books available for donation.
								</div>
							)}
							items={listedButNotDonatedBooks}
						>
							{(book) => (
								<Table.Row id={book.id}>
									<Table.Cell>{book.title}</Table.Cell>
									<Table.Cell>{book.author}</Table.Cell>
									<Table.Cell>{book.description}</Table.Cell>
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
			<div>
				<Card.Header
					className="px-0 pt-0 space-y-0.5"
					title="Requested Books"
					titleClassName="text-base md:text-lg"
					description="Books you've requested that are pending acceptance"
					descriptionClassName="text-sm"
				/>
				<Card>
					<Table aria-label="Requested Books">
						<Table.Header>
							<Table.Column isRowHeader>Title</Table.Column>
							<Table.Column>Author</Table.Column>
							<Table.Column>Requested by</Table.Column>
							<Table.Column>Requested on</Table.Column>
						</Table.Header>
						<Table.Body
							renderEmptyState={() => (
								<div className="text-center py-4 font-medium text-pretty">
									You currently have no requests.
								</div>
							)}
							items={activeRequestsReceived}
						>
							{(request) => (
								<Table.Row id={request.donation_request_id}>
									<Table.Cell>{request.book_title}</Table.Cell>
									<Table.Cell>{request.book_author}</Table.Cell>
									<Table.Cell>{request.requester_name}</Table.Cell>
									<Table.Cell>
										{new Date(request.request_date).toLocaleDateString()}
									</Table.Cell>
								</Table.Row>
							)}
						</Table.Body>
					</Table>
				</Card>
			</div>
		</div>
	);
}
