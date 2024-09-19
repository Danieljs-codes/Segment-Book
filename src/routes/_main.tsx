import IconHandCoin from "~/assets/hand-coins.svg?react";
import { isMatch, Link, useLocation, useMatches } from "@tanstack/react-router";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import {
	IconBell,
	IconChevronRight,
	IconContacts,
	IconFolderDelete,
	IconLogout,
	IconMessage,
	IconSearch,
	IconSettings,
	IconDashboard,
	IconBookOpen,
} from "justd-icons";
import { toast } from "sonner";
import { Logo } from "~components/logo";
import { useAuth } from "~lib/auth";
import { Avatar } from "~ui/avatar";
import { Aside } from "~ui/aside";
import { Button } from "~ui/button";
import { Menu } from "~ui/menu";

const routes = [
	{
		path: "/dashboard",
		title: "Overview",
		icon: IconDashboard,
	},
	{
		path: "/donations?search=all&page=1&pageSize=10",
		title: "Donations",
		icon: IconBookOpen,
	},
	{
		path: "/requests",
		title: "Requests",
		icon: IconHandCoin,
	},
	{
		path: "/notifications",
		title: "Notifications",
		icon: IconBell,
	},
	{
		path: "/messages",
		title: "Messages",
		icon: IconMessage,
	},
	{
		path: "/Profile",
		title: "Profile",
		icon: IconContacts,
	},
];

export const Route = createFileRoute("/_main")({
	beforeLoad: async ({ context }) => {
		const { session, isLoading } = context.auth;

		// Wait for the auth state to be determined
		while (isLoading) {
			await new Promise((resolve) => setTimeout(resolve, 50));
		}

		if (!session) {
			toast.error("You must be signed in to access this page.");
			throw redirect({
				to: "/sign-in",
			});
		}

		return { session };
	},
	loader: ({ context }) => {},
	component: MainLayout,
});

function MainLayout() {
	const { isLoading } = useAuth();
	const { pathname } = useLocation();
	const { session } = Route.useRouteContext();
	const matches = useMatches();

	if (matches.some((match) => match.status === "pending")) return null;

	const matchesWithCrumbs = matches.filter((match) =>
		isMatch(match, "loaderData.crumb"),
	);

	if (isLoading) {
		return <div>Loading...</div>; // Or a proper loading component
	}

	return (
		<Aside.Layout
			navbar={
				<Aside.Responsive>
					<Button
						aria-label="Search"
						appearance="plain"
						shape="circle"
						size="square-petite"
					>
						<IconSearch />
					</Button>
					<Button
						aria-label="Notifications"
						appearance="plain"
						shape="circle"
						size="square-petite"
					>
						<IconBell />
					</Button>
					<Menu>
						<Menu.Trigger>
							<Avatar
								shape="circle"
								src={`https://i.pravatar.cc/300?u=${session?.user?.email}`}
								size="medium"
							/>
						</Menu.Trigger>
						<Menu.Content className="min-w-[180px]">
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
				</Aside.Responsive>
			}
			aside={
				<>
					<Aside.Header>
						<Logo className="h-8 w-fit" />
					</Aside.Header>
					<Aside.Content>
						<Aside.Section>
							{routes.map((route) => (
								<Aside.Item
									key={route.path}
									icon={route.icon}
									// @ts-expect-error
									href={route.path}
									isCurrent={pathname === route.path.split("?")[0]}
								>
									{route.title}
								</Aside.Item>
							))}
						</Aside.Section>
					</Aside.Content>
					{/* <Aside.Footer>
						<Menu>
							<Menu.Trigger>
								<div className="flex items-center gap-x-3">
									<Avatar
										src={`https://i.pravatar.cc/300?u=${session?.user?.email}`}
										size="extra-small"
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
							</Menu.Trigger>
							<Menu.Content className="min-w-[180px]">
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
					</Aside.Footer> */}
				</>
			}
		>
			<nav
				aria-label="Breadcrumb"
				className="py-2 text-sm font-medium text-muted-fg"
			>
				<ol className="flex items-center gap-x-2">
					<li className="flex items-center gap-x-2">
						<Link to="/dashboard">Dashboard</Link>
						<IconChevronRight className="size-4" />
					</li>
					{matchesWithCrumbs.map((match, index) => (
						<li key={match.id}>
							{index < matchesWithCrumbs.length - 1 ? (
								<>
									<a
										href={match.pathname}
										className="text-blue-600 hover:underline"
									>
										{match.loaderData?.crumb}
									</a>
									<IconChevronRight className="size-4" />
								</>
							) : (
								<span className="text-fg">{match.loaderData?.crumb}</span>
							)}
						</li>
					))}
				</ol>
			</nav>
			<div>
				<Outlet />
			</div>
		</Aside.Layout>
	);
}
