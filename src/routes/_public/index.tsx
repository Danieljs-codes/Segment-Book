import { createFileRoute, Link } from "@tanstack/react-router";
import { IconArrowRight, IconBook, IconContacts } from "justd-icons";
import { useTheme } from "~components/theme-provider";
import { Badge } from "~ui/badge";
import { buttonStyles } from "~ui/button";
import { Separator } from "~ui/separator";

export const Route = createFileRoute("/_public/")({
	component: HomeComponent,
});

function HomeComponent() {
	const { theme } = useTheme();

	return (
		<div>
			<div className="flex flex-col items-center justify-center mt-16">
				<Link to="/books">
					<Badge shape="circle" className="mb-4" intent="success">
						Check out the latest books
						<IconArrowRight />
					</Badge>
				</Link>
				<h1 className="text-3xl font-bold text-center">
					Share Books, Spread Knowledge
				</h1>
				<p className="text-base leading-5 text-center text-muted-fg mt-3">
					Segment connects book lovers. Donate your books and discover new
					reads, all for free.
				</p>
				<div className="mt-8 flex flex-col w-full gap-3 md:flex-row items-center justify-center">
					<Link
						to="/donations/new"
						className={buttonStyles({
							size: "small",
							intent: "primary",
							className: "w-full sm:w-fit",
						})}
						preload={false}
					>
						Donate a Book
					</Link>
					<Link
						to="/books"
						className={buttonStyles({
							size: "small",
							intent: "secondary",
							className: "w-full sm:w-fit",
						})}
					>
						Browse Books
					</Link>
				</div>
				{theme === "dark" && (
					<img
						src="/dashboard-dark.png"
						alt="Books"
						className="w-auto h-auto object-contain mt-20"
					/>
				)}
				{theme === "light" && (
					<img
						src="/dashboard.png"
						alt="Books"
						className="w-auto h-auto object-contain mt-20"
					/>
				)}
			</div>
			<Separator className="my-10" />
			{/* Features */}
			<h2 className="text-2xl font-bold text-center mb-6">Features</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
				<div className="flex flex-col items-center justify-center">
					<div
						className={buttonStyles({
							intent: "secondary",
							size: "square-petite",
							className: "mb-4",
						})}
					>
						<IconBook />
					</div>
					<h3 className="text-center text-fg text-lg font-semibold leading-7">
						Donate Books
					</h3>
					<p className="text-center text-muted-fg text-sm  leading-normal">
						List your books for donation and help others discover new reads.
						Declutter your space and contribute to a community of book lovers.
					</p>
				</div>
				<div className="flex flex-col items-center justify-center">
					<div
						className={buttonStyles({
							intent: "secondary",
							size: "square-petite",
							className: "mb-4",
						})}
					>
						<IconBook />
					</div>
					<h3 className="text-center text-fg text-lg font-semibold leading-7">
						Request Book
					</h3>
					<p className="text-center text-muted-fg text-sm leading-normal">
						Explore our collection and request books that spark your interest.
					</p>
				</div>
				<div className="flex flex-col items-center justify-center">
					<div
						className={buttonStyles({
							intent: "secondary",
							size: "square-petite",
							className: "mb-4",
						})}
					>
						<IconContacts />
					</div>
					<h3 className="text-center text-fg text-lg font-semibold leading-7">
						Connect with Readers
					</h3>
					<p className="text-center text-muted-fg text-sm leading-normal">
						Build a community of book lovers and share your passion for reading.
					</p>
				</div>
			</div>
			{/* End of Features */}
			<Separator className="my-10" />
			{/* How It Works */}
			<div className="flex flex-col items-center justify-center mt-16">
				<h2 className="text-2xl font-bold text-center">How It Works</h2>
				<p className="text-base leading-5 text-center text-muted-fg mt-3">
					Follow these simple steps to get started with Segment.
				</p>
				<div className="mt-8 flex flex-col w-full gap-10 md:flex-row items-center justify-center">
					<div className="flex flex-col items-center justify-center">
						<div
							className={buttonStyles({
								intent: "secondary",
								size: "square-petite",
								className: "mb-4",
							})}
						>
							<IconBook />
						</div>
						<h3 className="text-center text-fg text-lg font-semibold leading-7">
							Sign Up
						</h3>
						<p className="text-center text-muted-fg text-sm leading-normal">
							Create an account to join our community of book lovers.
						</p>
					</div>
					<div className="flex flex-col items-center justify-center">
						<div
							className={buttonStyles({
								intent: "secondary",
								size: "square-petite",
								className: "mb-4",
							})}
						>
							<IconBook />
						</div>
						<h3 className="text-center text-fg text-lg font-semibold leading-7">
							Donate or Request
						</h3>
						<p className="text-center text-muted-fg text-sm leading-normal">
							List your books for donation or request books from others.
						</p>
					</div>
					<div className="flex flex-col items-center justify-center">
						<div
							className={buttonStyles({
								intent: "secondary",
								size: "square-petite",
								className: "mb-4",
							})}
						>
							<IconContacts />
						</div>
						<h3 className="text-center text-fg text-lg font-semibold leading-7">
							Connect
						</h3>
						<p className="text-center text-muted-fg text-sm leading-normal">
							Reach out to other members to arrange book exchanges.
						</p>
					</div>
				</div>
			</div>
			{/* End of How It Works */}
			<Separator className="my-10" />
			<div className="bg-accent py-10 px-4 mb-2">
				<h3 className="text-2xl font-bold text-center">
					Ready to start sharing books?
				</h3>
				<p className="text-base leading-5 text-center text-muted-fg mt-3">
					Segment is free to use and open to everyone.
				</p>
				<div className="mt-8 flex flex-col w-full gap-3 md:flex-row items-center justify-center">
					<Link
						to="/donations/new"
						className={buttonStyles({
							size: "small",
							intent: "primary",
							className: "w-full sm:w-fit",
						})}
						preload={false}
					>
						Donate a Book
					</Link>
				</div>
			</div>
			{/* Footer */}
			<footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-border">
				<p className="text-xs text-muted-fg">
					© 2024 Segment. All rights reserved.
				</p>
				<nav className="sm:ml-auto flex gap-4 sm:gap-6">
					<Link to="/" className="text-xs hover:underline underline-offset-4">
						Terms of Service
					</Link>
					<Link to="/" className="text-xs hover:underline underline-offset-4">
						Privacy
					</Link>
				</nav>
			</footer>
		</div>
	);
}
