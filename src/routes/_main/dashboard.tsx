import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
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
	listedAndDonatedQueryOptions,
} from "~lib/query-options";
import { Card } from "~ui/card";
import { Grid } from "~ui/grid";
import { Heading } from "~ui/heading";
import { Menu } from "~ui/menu";
import { Table } from "~ui/table";
import { Skeleton } from "~ui/skeleton";
import { Badge } from "~ui/badge";

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
		queryClient.ensureQueryData(listedAndDonatedQueryOptions(userId));

		return {
			crumb: "Overview",
			title: `Welcome back, ${session?.user?.user_metadata?.full_name
				?.split(" ")
				.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ")}`,
			userId,
		};
	},
	pendingComponent: DashboardSkeleton,
	component: OverviewComponent,
});

function DashboardSkeleton() {
	return (
		<div>
			<Skeleton className="w-48 h-8 mb-4" />
			<div className="mb-6">
				<Grid
					className="divide-y lg:divide-y-0 lg:divide-x lg:border-x"
					columns={{ initial: 1, lg: 4 }}
				>
					{[...Array(4)].map((_, index) => (
						<Card
							key={index}
							className="border-y-0 shadow-none border-x-0 rounded-none py-4 lg:px-6"
						>
							<Card.Header className="p-0">
								<Skeleton className="w-16 h-6 mb-2" />
								<Skeleton className="w-32 h-4" />
							</Card.Header>
						</Card>
					))}
				</Grid>
			</div>
			<div className="mb-6">
				<Card.Header
					className="px-0 pt-0 space-y-0.5"
					// @ts-expect-error - TODO: Fix this
					title={<Skeleton className="w-64 h-6" />}
					// @ts-expect-error - TODO: Fix this
					description={<Skeleton className="w-96 h-4" />}
				/>
				<Card>
					<Table aria-label="Books Available for Donation">
						<Table.Header>
							{[...Array(4)].map((_, index) => (
								<Table.Column isRowHeader key={index}>
									<Skeleton className="w-24 h-4" />
								</Table.Column>
							))}
						</Table.Header>
						<Table.Body>
							{[...Array(3)].map((_, rowIndex) => (
								<Table.Row key={rowIndex}>
									{[...Array(4)].map((_, cellIndex) => (
										<Table.Cell key={cellIndex}>
											<Skeleton className="w-full h-4" />
										</Table.Cell>
									))}
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				</Card>
			</div>
			<div>
				<Card.Header
					className="px-0 pt-0 space-y-0.5"
					// @ts-expect-error - TODO: Fix this
					title={<Skeleton className="w-48 h-6" />}
					// @ts-expect-error - TODO: Fix this
					description={<Skeleton className="w-80 h-4" />}
				/>
				<Card>
					<Table aria-label="Requested Books">
						<Table.Header>
							{[...Array(4)].map((_, index) => (
								<Table.Column isRowHeader key={index}>
									<Skeleton className="w-24 h-4" />
								</Table.Column>
							))}
						</Table.Header>
						<Table.Body>
							{[...Array(3)].map((_, rowIndex) => (
								<Table.Row key={rowIndex}>
									{[...Array(4)].map((_, cellIndex) => (
										<Table.Cell key={cellIndex}>
											<Skeleton className="w-full h-4" />
										</Table.Cell>
									))}
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				</Card>
			</div>
		</div>
	);
}

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
	const { data: listedButNotDonatedBooks } = useSuspenseQuery(
		listedButNotDonatedBooksQueryOptions(userId),
	);
	const { data: bookListedButNotDonated } = useSuspenseQuery(
		bookListedButNotDonatedQueryOptions(userId),
	);
	const { data: listedAndDonatedBooks } = useSuspenseQuery(
		listedAndDonatedQueryOptions(userId),
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
							description="Listed books awaiting donation"
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
					description="Your recently listed books but haven't donated yet"
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
							<Table.Column>Description</Table.Column>
							<Table.Column>Language</Table.Column>
							<Table.Column>Condition</Table.Column>
						</Table.Header>
						<Table.Body
							renderEmptyState={() => (
								<div className="text-center py-4 font-medium text-pretty">
									You currently have no requests.
								</div>
							)}
							items={listedAndDonatedBooks}
						>
							{(request) => (
								<Table.Row id={request.id}>
									<Table.Cell>{request.title}</Table.Cell>
									<Table.Cell>{request.author}</Table.Cell>
									<Table.Cell>
										{request.description && request.description.length > 50
											? `${request.description.slice(0, 50)}...`
											: request.description}
									</Table.Cell>
									<Table.Cell>
										<Badge className="capitalize">{request.language}</Badge>
									</Table.Cell>
									<Table.Cell>
										<Badge className="capitalize">{request.condition}</Badge>
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
