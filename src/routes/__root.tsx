import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	ScrollRestoration,
} from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import type { AuthContextType } from "~lib/auth";
import { Toast } from "~ui/toast";

interface MyRouterContext {
	auth: AuthContextType;
	queryClient: QueryClient;
}

const TanStackRouterDevtools =
	process.env.NODE_ENV === "production"
		? () => null // Render nothing in production
		: lazy(() =>
				// Lazy load in development
				import("@tanstack/router-devtools").then((res) => ({
					default: res.TanStackRouterDevtools,
					// For Embedded Mode
					// default: res.TanStackRouterDevtoolsPanel
				})),
			);

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<ScrollRestoration />
			<Outlet />
			<Suspense>
				<TanStackRouterDevtools />
			</Suspense>
			<Toast />
		</>
	);
}
