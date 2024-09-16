import { isMatch, Link, useMatches } from "@tanstack/react-router";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import {
	IconBell,
	IconChevronRight,
	IconContacts,
	IconFolderDelete,
	IconHamburger,
	IconLogout,
	IconSearch,
	IconSettings,
} from "justd-icons";
import { toast } from "sonner";
import { Logo } from "~components/logo";
import { useAuth } from "~lib/auth";
import { Avatar } from "~ui/avatar";
import { Button, buttonStyles } from "~ui/button";
import { Menu } from "~ui/menu";

const routes = [
	{
		path: "/dashboard",
		title: "Overview",
	},
	{
		path: "/transactions",
		title: "Transactions",
	},
	{
		path: "/wallets",
		title: "Wallets",
	},
	{
		path: "/settings",
		title: "Settings",
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
		<div>
			{/* Top Nav Bar */}
			<div className="p-4 flex items-center justify-between border-b border-border mb-6">
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
								<Avatar
									src={`https://i.pravatar.cc/300?u=${session?.user?.email}`}
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
					</div>
				</div>
				{/* Mobile Icon */}
				<Button className="md:hidden" size="square-petite" appearance="plain">
					<IconHamburger />
					<span className="sr-only">Open menu</span>
				</Button>
			</div>
			{/* End of Top Nav Bar */}
			<nav
				aria-label="Breadcrumb"
				className="px-4 py-2 text-sm font-medium text-muted-fg"
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
			<div className="px-4">
				<Outlet />
			</div>
		</div>
	);
}
