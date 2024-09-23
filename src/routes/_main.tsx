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
	IconChevronLgDown,
	IconMoon,
	IconSun,
	IconHome,
} from "justd-icons";
import { toast } from "sonner";
import { Logo } from "~components/logo";
import { useAuth } from "~lib/auth";
import { Avatar } from "~ui/avatar";
import { Aside } from "~ui/aside";
import { Button } from "~ui/button";
import { Menu } from "~ui/menu";
import { useTheme } from "~components/theme-provider";
import { supabase } from "~lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { flushSync } from "react-dom";

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

		const { data: user } = await supabase
			.from("users")
			.select("*")
			.eq("id", session.user.id)
			.limit(1)
			.single();

		if (!user) {
			toast.error("You must be signed in to access this page.");
			throw redirect({
				to: "/sign-in",
			});
		}

		return { session, user };
	},
	loader: ({ context }) => {},
	component: MainLayout,
});

function MainLayout() {
	const { isLoading, signOut, updateSession } = useAuth();
	const navigate = Route.useNavigate();
	const { setTheme, theme } = useTheme();
	const { pathname } = useLocation();
	const { session, user } = Route.useRouteContext();
	const matches = useMatches();

	const { mutateAsync: signOutUser } = useMutation({
		mutationKey: ["signOut"],
		mutationFn: async () => {
			await signOut();
		},
		onSuccess: () => {
			flushSync(() => {
				updateSession(null);
			});
			navigate({ to: "/sign-in" });
		},
	});

	const handleSignOut = () => {
		toast.promise(signOutUser(), {
			loading: "Signing out...",
			success: "Signed out successfully!",
			error: "Failed to sign out",
		});
	};

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
						onPress={() => setTheme(theme === "light" ? "dark" : "light")}
					>
						{theme === "light" ? <IconMoon /> : <IconSun />}
					</Button>
					<Button
						aria-label="Notifications"
						appearance="plain"
						shape="circle"
						size="square-petite"
					>
						<IconSearch />
					</Button>
					<Menu>
						<Menu.Trigger>
							<Avatar
								initials={
									user.name
										.split(" ")
										.map((word) => word[0])
										.join("") || ""
								}
								shape="circle"
								src={user.avatar}
								size="medium"
							/>
						</Menu.Trigger>
						<Menu.Content>
							<Menu.Item href="/" className="text-sm">
								<IconHome />
								Home
							</Menu.Item>
							<Menu.Item className="text-sm">
								<IconContacts />
								Profile
							</Menu.Item>
							<Menu.Item className="text-sm">
								<IconSettings />
								Settings
							</Menu.Item>
							<Menu.Item onAction={handleSignOut} className="text-sm">
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
				</Aside.Responsive>
			}
			aside={
				<>
					<Aside.Header>
						<Link to="/dashboard">
							<Logo className="h-8 w-fit" />
						</Link>
					</Aside.Header>
					<Aside.Content>
						<Aside.Section>
							{routes.map((route) => (
								<Aside.Item
									key={route.path}
									icon={route.icon}
									// @ts-expect-error
									href={route.path}
									isCurrent={pathname.startsWith(route.path.split("?")[0])}
								>
									{route.title}
								</Aside.Item>
							))}
						</Aside.Section>
					</Aside.Content>
					<Aside.Footer className="lg:flex lg:flex-row hidden items-center">
						<Menu>
							<Button
								appearance="plain"
								aria-label="Profile"
								className="group w-full justify-start flex"
							>
								<Avatar
									size="extra-small"
									shape="square"
									className="-ml-1.5"
									initials={
										user.name
											.split(" ")
											.map((word) => word[0])
											.join("") || ""
									}
									src={user.avatar}
								/>
								{session.user.user_metadata?.full_name
									?.split(" ")
									.map(
										(word: string) =>
											word.charAt(0).toUpperCase() + word.slice(1),
									)
									.join(" ")}
								<IconChevronLgDown className="right-3 absolute group-pressed:rotate-180 transition-transform" />
							</Button>

							<Menu.Content className="min-w-[--trigger-width]">
								<Menu.Item href="/">
									<IconHome />
									Home
								</Menu.Item>
								<Menu.Item href="/profile">
									<IconContacts />
									Profile
								</Menu.Item>
								<Menu.Item>
									<IconSettings />
									Settings
								</Menu.Item>
								<Menu.Item
									onAction={() =>
										setTheme(theme === "light" ? "dark" : "light")
									}
								>
									{theme === "light" ? <IconMoon /> : <IconSun />}
									Toggle Theme
								</Menu.Item>
								<Menu.Item onAction={handleSignOut}>
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
					</Aside.Footer>
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
