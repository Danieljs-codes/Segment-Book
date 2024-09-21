import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { IconBookOpen, IconGlobe, IconMap } from "justd-icons";
import { allDonorsQueryOptions } from "~lib/query-options";
import { Avatar } from "~ui/avatar";
import { Badge } from "~ui/badge";
import { buttonStyles } from "~ui/button";
import { Card } from "~ui/card";
import { Heading } from "~ui/heading";

export const Route = createFileRoute("/_public/authors/")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(allDonorsQueryOptions());
	},
	component: Authors,
});

function Authors() {
	const { data: donors } = useSuspenseQuery(allDonorsQueryOptions());
	return (
		<div>
			<Heading className="mb-4" level={2} tracking="tight">
				Our Generous Donors
			</Heading>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{donors.map((donor) => (
					<Card key={donor.id}>
						<Card.Header className="flex flex-row items-center gap-4">
							<Avatar
								size="large"
								src={`https://i.pravatar.cc/300?u=${donor.email}`}
							/>
							<div>
								<Card.Title className="text-lg font-bold">
									{donor.name}
								</Card.Title>
								<p className="text-sm text-muted-fg flex items-center gap-1">
									<IconMap className="w-4 h-4" />
									NY, New York
								</p>
							</div>
						</Card.Header>
						<Card.Content>
							<div className="flex items-center gap-2">
								<IconBookOpen />
								<p className="text-sm font-medium">
									{donor.donated_books} books donated
								</p>
							</div>
							<Badge
								intent="secondary"
								className="capitalize mt-2"
								shape="circle"
							>
								Joined at:{" "}
								{new Date(donor.createdAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</Badge>
						</Card.Content>
						<Card.Footer>
							<Link
								to="/authors/$authorId"
								params={{ authorId: donor.id }}
								className={buttonStyles({ size: "small", className: "w-full" })}
							>
								View Profile
							</Link>
						</Card.Footer>
					</Card>
				))}
			</div>
		</div>
	);
}
