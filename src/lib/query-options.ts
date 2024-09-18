import { queryOptions } from "@tanstack/react-query";
import { supabase } from "./supabase";

export const totalDonationsQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["total-donations", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("books")
				.select("id")
				.eq("ownerId", userId)
				.eq("isDonated", true);

			if (error) {
				console.error("Error fetching donated books:", error);
				throw new Error(error.message);
			}

			return data?.length ?? 0;
		},
	});

export const booksReceivedQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["books-received", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("donation_requests")
				.select(`id, books(title, author)`)
				.eq("requesterId", userId)
				.eq("status", "COMPLETED");

			if (error) {
				console.error("Error fetching received books:", error);
				throw new Error(error.message);
			}

			return data ?? [];
		},
	});

export const activeRequestsReceivedQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["active-requests-received", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.rpc('get_active_requests_received', { user_id: userId });

			if (error) {
				console.error("Error fetching active requests received:", error);
				throw new Error(error.message);
			}

			return data ?? [];
		},
	});

export const activeRequestsSentQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["active-requests-sent", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.rpc('get_active_requests_sent', { user_id: userId });

			if (error) {
				console.error("Error fetching active requests sent:", error);
				throw new Error(error.message);
			}

			return data ?? [];
		},
	});

export const listedButNotDonatedBooksQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["listed-not-donated-books", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("books")
				.select("id, title, author, description")
				.eq("ownerId", userId)
				.eq("isDonated", false);

			if (error) {
				console.error("Error fetching listed but not donated books:", error);
				throw new Error(error.message);
			}

			return data ?? [];
		},
	});

	export const bookListedButNotDonatedQueryOptions = (userId: string) => queryOptions({
		queryKey: ["book-listed-not-donated", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("books")
				.select("id, title, author, description")
				.eq("ownerId", userId)
				.eq("isDonated", false);

			if (error) {
				console.error("Error fetching book listed but not donated:", error);
				throw new Error(error.message);
			}

			return data ?? [];
		},
	});