import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
	IconBell,
	IconContacts,
	IconDashboard,
	IconFolderDelete,
	IconHamburger,
	IconLogout,
	IconSearch,
	IconSettings,
} from "justd-icons";
import { useState } from "react";
import { Logo } from "~components/logo";
import { Avatar } from "~ui/avatar";
import { Button, buttonStyles } from "~ui/button";
import { Container } from "~ui/container";
import { Menu } from "~ui/menu";
import { Sheet } from "~ui/sheet";

export const Route = createFileRoute("/_public")({
	loader: async ({ context }) => {
		const { session, isLoading } = context.auth;

		// Wait for the auth state to be determined
		while (isLoading) {
			await new Promise((resolve) => setTimeout(resolve, 50));
		}

		return { session };
	},
	component: Home,
});

const routes = [
	{
		path: "/",
		title: "Home",
	},
	{
		path: "/books",
		title: "Books",
	},
	{
		path: "/authors",
		title: "Authors",
	},
];

function Home() {
	const { session } = Route.useLoaderData();
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	return (
		<div>
			{/* Top Nav Bar */}
			<div className="p-4 flex items-center justify-between border-b border-border">
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-x-4">
						<Logo className="h-8 w-auto" />
						{/* list of links on desktop */}
						<div className="hidden md:flex items-center gap-x-2">
							{routes.map((route) => (
								<Link
									className={buttonStyles({
										appearance: "plain",
										size: "extra-small",
										className: "px-2",
									})}
									key={route.path}
									to={route.path}
									activeProps={{
										className: "bg-fg/5",
									}}
								>
									{route.title}
								</Link>
							))}
						</div>
					</div>
					{session && (
						<div className="hidden md:flex gap-x-3">
							<div className="space-x-1">
								<Button size="square-petite" appearance="plain">
									<IconSearch className="size-5" />
								</Button>
								<Button size="square-petite" appearance="plain">
									<IconBell className="size-5" />
								</Button>
							</div>
							<Menu>
								<Menu.Trigger>
									<Avatar src={`https://i.pravatar.cc/300?u=${"irsyadadl"}`} />
								</Menu.Trigger>
								<Menu.Content className="min-w-[180px]">
									<Menu.Item href="/dashboard">
										<IconDashboard />
										Dashboard
									</Menu.Item>
									<Menu.Item>
										<IconContacts />
										Profile
									</Menu.Item>
									<Menu.Item>
										<IconSettings />
										Settings
									</Menu.Item>
									<Menu.Item>
										<IconLogout />
										Sign out
									</Menu.Item>
									<Menu.Separator />
									<Menu.Item isDanger>
										<IconFolderDelete />
										Delete Account
									</Menu.Item>
								</Menu.Content>
							</Menu>
						</div>
					)}
					{!session && (
						<div className="hidden md:flex gap-x-2">
							<Link
								to="/sign-in"
								className={buttonStyles({
									intent: "secondary",
									size: "extra-small",
								})}
							>
								Sign In
							</Link>
							<Link
								to="/sign-up"
								className={buttonStyles({
									size: "extra-small",
								})}
							>
								Sign Up
							</Link>
						</div>
					)}
				</div>
				{/* Mobile Icon */}
				<Button
					onPress={() => setIsSheetOpen(true)}
					className="md:hidden"
					size="square-petite"
					appearance="plain"
				>
					<IconHamburger />
					<span className="sr-only">Open menu</span>
				</Button>
			</div>
			{/* End of Top Nav Bar */}
			{/* Sheet */}
			<Sheet>
				<Sheet.Content
					isOpen={isSheetOpen}
					onOpenChange={setIsSheetOpen}
					isBlurred
					side="left"
				>
					<Sheet.Header className="mb-6 border-b border-border">
						<div className="flex items-center">
							<Logo className="h-8 w-auto" />
						</div>
					</Sheet.Header>
					<Sheet.Body className="gap-1">
						{routes.map((route) => (
							<Link
								key={route.path}
								to={route.path}
								className={buttonStyles({
									appearance: "plain",
									size: "small",
									className: "text-left justify-normal",
								})}
								activeProps={{
									className: "bg-fg/5",
								}}
							>
								{route.title}
							</Link>
						))}
					</Sheet.Body>
					<Sheet.Footer>
						{session && (
							<Menu>
								<Menu.Trigger>
									<div className="flex justify-between">
										<div className="flex items-center gap-x-3">
											<Avatar
												src={`https://i.pravatar.cc/300?u=${session?.user?.email}`}
											/>
											<div>
												<span className="text-sm font-medium text-fg block -mb-1.5">
													{session.user.user_metadata?.full_name}
												</span>
												<span className="text-muted-fg text-xs">
													{session.user.email}
												</span>
											</div>
										</div>
										<IconLogout className="size-5 text-muted-fg" />
									</div>
								</Menu.Trigger>
								<Menu.Content className="min-w-[180px]">
									<Menu.Item href="/dashboard" className="text-sm">
										<IconDashboard />
										Dashboard
									</Menu.Item>
									<Menu.Item className="text-sm">
										<IconContacts />
										Profile
									</Menu.Item>
									<Menu.Item className="text-sm">
										<IconSettings />
										Settings
									</Menu.Item>
									<Menu.Item className="text-sm">
										<IconLogout />
										Sign out
									</Menu.Item>
									<Menu.Separator />
									<Menu.Item className="text-sm" isDanger>
										<IconFolderDelete />
										Delete Account
									</Menu.Item>
								</Menu.Content>
							</Menu>
						)}
						{!session && (
							<div className="flex gap-x-2">
								<Link
									to="/sign-in"
									className={buttonStyles({
										intent: "secondary",
										size: "small",
										className: "w-full",
									})}
								>
									Sign In
								</Link>
								<Link
									to="/sign-up"
									className={buttonStyles({
										size: "small",
										className: "w-full",
									})}
								>
									Sign Up
								</Link>
							</div>
						)}
					</Sheet.Footer>
				</Sheet.Content>
			</Sheet>
			<Container className="py-4">
				<Outlet />
			</Container>
		</div>
	);
}
