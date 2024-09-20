import { createFileRoute } from "@tanstack/react-router";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Grid } from "~/components/ui/grid";
import { Heading } from "~/components/ui/heading";
import { TextField } from "~/components/ui/text-field";
import { Textarea } from "~/components/ui/textarea";
import { useMediaQuery } from "~ui/primitive";

export const Route = createFileRoute("/_main/profile")({
	loader: () => {
		return {
			crumb: "Profile",
			title: "Profile",
		};
	},
	component: Profile,
});

function Profile() {
	const isMobile = useMediaQuery("(max-width: 600px)");
	return (
		<div>
			<Heading level={1} className="mb-6 sm:mb-8">
				Profile
			</Heading>
			<Grid columns={{ initial: 1, md: 2 }} gap={6}>
				<Card>
					<Card.Header>
						<Card.Title>Personal Information</Card.Title>
					</Card.Header>
					<Card.Content>
						<div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-6">
							<Avatar
								size="large"
								src={`https://i.pravatar.cc/300?u=${"irsyadadl"}`}
								alt="User Avatar"
								className="mb-4 sm:mb-0"
							/>
							<Button
								size={isMobile ? "extra-small" : "small"}
								className="w-full sm:w-auto"
							>
								Change Avatar
							</Button>
						</div>
						<form className="space-y-4">
							<TextField label="Full Name" placeholder="Enter your full name" />
							<TextField
								label="Email"
								placeholder="Enter your email"
								type="email"
							/>
							<TextField
								label="Phone"
								placeholder="Enter your phone number"
								type="tel"
							/>
							<Textarea
								label="Bio"
								placeholder="Tell us about yourself"
								rows={4}
							/>
							<Button intent="primary" className="w-full sm:w-auto">
								Save Changes
							</Button>
						</form>
					</Card.Content>
				</Card>
				<Card>
					<Card.Header>
						<Card.Title>Account Settings</Card.Title>
					</Card.Header>
					<Card.Content>
						<form className="space-y-4">
							<TextField label="Username" placeholder="Enter your username" />
							<TextField
								label="Current Password"
								type="password"
								placeholder="Enter your current password"
							/>
							<TextField
								label="New Password"
								type="password"
								placeholder="Enter a new password"
							/>
							<TextField
								label="Confirm New Password"
								type="password"
								placeholder="Confirm your new password"
							/>
							<Button intent="primary" className="w-full sm:w-auto">
								Update Password
							</Button>
						</form>
					</Card.Content>
				</Card>
			</Grid>
		</div>
	);
}
