import { createFileRoute, Link } from "@tanstack/react-router";
import { donorsByIdQueryOptions } from "~lib/query-options";
import { Heading } from "~ui/heading";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card } from "~ui/card";
import { Avatar } from "~ui/avatar";
import { Badge } from "~ui/badge";
import { Tabs } from "~ui/tabs";
import { IconChevronLeft } from "justd-icons";
import { buttonStyles } from "~ui/button";

export const Route = createFileRoute("/_public/authors/$authorId")({
	loader: ({ context, params }) => {
		context.queryClient.ensureQueryData(
			donorsByIdQueryOptions(params.authorId),
		);
	},
	component: Author,
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

function Author() {
	const { authorId } = Route.useParams();
	const { data: books } = useSuspenseQuery(donorsByIdQueryOptions(authorId));

	const booksListedButNotDonated = books.filter(
		(book) => book.isDonated === false,
	);

	const booksListedAndDonated = books.filter((book) => book.isDonated === true);

	return (
		<div>
			<Link
				to="/authors"
				className={buttonStyles({
					size: "extra-small",
					appearance: "outline",
					className: "mb-4",
				})}
			>
				<IconChevronLeft />
				Back to authors
			</Link>
			<Heading className="mb-4" level={2} tracking="tight">
				Author Profile
			</Heading>
			<div className="mb-4">
				<Card>
					<Card.Header>
						<div className="flex gap-4 items-center">
							<Avatar
								className="size-20"
								src={`https://i.pravatar.cc/300?u=${books[0]?.donor?.email}`}
							/>
							<div>
								<h2 className="font-bold text-lg mb-1">
									{books[0]?.donor?.name}
								</h2>
								<Badge intent="success" shape="circle">
									Joined:{" "}
									{books[0]?.donor?.createdAt
										? new Date(books[0].donor.createdAt).toLocaleDateString(
												"en-US",
												{ year: "numeric", month: "short", day: "numeric" },
											)
										: "Unknown"}
								</Badge>
							</div>
						</div>
					</Card.Header>
					<Card.Content>
						<p className="text-sm text-muted-fg">
							Lorem ipsum dolor sit amet consectetur, adipisicing elit.
							Doloribus adipisci ipsum ad, quis ut mollitia temporibus explicabo
							facilis nesciunt quidem.
						</p>
					</Card.Content>
					<Card.Footer>
						<div className="flex items-center gap-2">
							<Badge intent="primary" shape="circle">
								{booksListedButNotDonated.length} Current Listings
							</Badge>
							<Badge intent="primary" shape="circle">
								{booksListedAndDonated.length} Books Donated
							</Badge>
						</div>
					</Card.Footer>
				</Card>
			</div>
			<div>
				<Tabs className="w-fit">
					<Tabs.List>
						<Tabs.Tab id="books-donated">
							Donated Books ({booksListedAndDonated.length})
						</Tabs.Tab>
						<Tabs.Tab id="books-listed">
							Current Listings ({booksListedButNotDonated.length})
						</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel id="books-donated">
						{booksListedAndDonated.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{booksListedAndDonated.map((book) => (
									<Card
										key={book.id}
										className="overflow-hidden cursor-pointer"
									>
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
												<p className="text-sm text-muted-fg mb-2">
													{book.author}
												</p>
												<p className="text-xs text-muted-fg">
													<span className="font-medium text-fg">
														Listed on:
													</span>{" "}
													{new Date(book.createdAt).toLocaleDateString(
														"en-US",
														{
															year: "numeric",
															month: "short",
															day: "numeric",
														},
													)}
												</p>
											</div>
										</Card.Content>
									</Card>
								))}
							</div>
						) : (
							<p className="text-muted-fg">
								This user hasn't donated any books yet.
							</p>
						)}
					</Tabs.Panel>
					<Tabs.Panel id="books-listed">
						{booksListedButNotDonated.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{booksListedButNotDonated.map((book) => (
									<Card
										key={book.id}
										className="overflow-hidden cursor-pointer"
									>
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
												<div>
													<p className="text-sm text-muted-fg mb-2">
														{book.author}
													</p>
													<p className="text-xs text-muted-fg">
														<span className="font-medium text-fg">
															Listed on:
														</span>{" "}
														{new Date(book.createdAt).toLocaleDateString(
															"en-US",
															{
																year: "numeric",
																month: "short",
																day: "numeric",
															},
														)}
													</p>
												</div>
											</div>
										</Card.Content>
									</Card>
								))}
							</div>
						) : (
							<p className="text-muted-fg">
								No books are currently listed by this user.
							</p>
						)}
					</Tabs.Panel>
				</Tabs>
			</div>
		</div>
	);
}
