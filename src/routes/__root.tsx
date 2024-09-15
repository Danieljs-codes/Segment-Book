import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import type { AuthContextType } from "~lib/auth";
import { Toast } from "~ui/toast";

interface MyRouterContext {
	auth: AuthContextType;
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<Outlet />
			<TanStackRouterDevtools position="bottom-right" />
			<Toast />
		</>
	);
}
