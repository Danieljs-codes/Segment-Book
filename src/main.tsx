import "./main.css";
import ReactDOM from "react-dom/client";
import {
	type NavigateOptions,
	RouterProvider,
	type ToOptions,
	createRouter,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "~lib/auth";
import { StrictMode } from "react";
import { ThemeProvider } from "~components/theme-provider";
import nProgress from "nprogress";
import { RouterProvider as ReactAriaRouterProvider } from "react-aria-components";
import { useRouter } from "@tanstack/react-router";

export const queryClient = new QueryClient();

// Set up a Router instance
const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	context: {
		auth: undefined!,
		queryClient,
	},
});

// Register things for typesafety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

declare module "react-aria-components" {
	interface RouterConfig {
		href: ToOptions["to"];
		routerOptions: Omit<NavigateOptions, keyof ToOptions>;
	}
}

const rootElement = document.getElementById("app")!;

function InnerApp() {
	const auth = useAuth();
	return (
		<RouterProvider
			router={router}
			context={{ auth }}
			InnerWrap={({ children }) => {
				const router = useRouter();
				return (
					<ReactAriaRouterProvider
						navigate={(to, options) => router.navigate({ to, ...options })}
						// @ts-expect-error - Copied Directly from react-aria-components documentation
						useHref={(to) => router.buildLocation(to).href}
					>
						{children}
					</ReactAriaRouterProvider>
				);
			}}
			Wrap={({ children }) => (
				<ThemeProvider>
					<QueryClientProvider client={queryClient}>
						{children}
					</QueryClientProvider>
				</ThemeProvider>
			)}
		/>
	);
}

function App() {
	return (
		<AuthProvider>
			<InnerApp />
		</AuthProvider>
	);
}

nProgress.configure({ showSpinner: false });

router.subscribe(
	"onBeforeLoad",
	({ pathChanged }) => pathChanged && nProgress.start(),
);
router.subscribe("onLoad", () => nProgress.done());

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}
