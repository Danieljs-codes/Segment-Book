import "./main.css";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "~lib/auth";

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

const rootElement = document.getElementById("app");

function App() {
	const auth = useAuth();
	return (
		<RouterProvider
			router={router}
			context={{ auth }}
			Wrap={({ children }) => <AuthProvider>{children}</AuthProvider>}
		/>
	);
}

if (rootElement) {
	if (!rootElement.innerHTML) {
		const root = ReactDOM.createRoot(rootElement);
		root.render(
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>,
		);
	}
}
