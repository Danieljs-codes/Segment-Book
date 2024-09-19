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
			const { data, error } = await supabase.rpc(
				"get_active_requests_received",
				{ user_id: userId },
			);

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
			const { data, error } = await supabase.rpc("get_active_requests_sent", {
				user_id: userId,
			});

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

export const bookListedButNotDonatedQueryOptions = (userId: string) =>
	queryOptions({
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

export const userDonatedBooksQueryOptions = (
	userId: string,
	page = 1,
	pageSize = 10,
	status: 'donated' | 'not donated' | 'all' | 'notDonated' = 'all',
) =>
	queryOptions({
		queryKey: ["user-donated-books", userId, page, pageSize, status],
		queryFn: async () => {
			const startIndex = (page - 1) * pageSize;
			const endIndex = startIndex + pageSize - 1;

			let query = supabase
				.from("books")
				.select("id, title, author, description, isDonated, createdAt", {
					count: "exact",
				})
				.eq("ownerId", userId)
				.order("createdAt", { ascending: false });

			if (status === 'donated') {
				query = query.eq("isDonated", true);
			} else if (status === 'not donated' || status === 'notDonated') {
				query = query.eq("isDonated", false);
			}

			const { data, error, count } = await query.range(startIndex, endIndex);

			if (error) {
				console.error("Error fetching user's books:", error);
				throw new Error(error.message);
			}

			return {
				books: data ?? [],
				totalCount: count ?? 0,
				currentPage: page,
				pageSize: pageSize,
				totalPages: Math.ceil((count ?? 0) / pageSize),
			};
		},
	});

	export const userRequestsQueryOptions = (
		userId: string,
		page = 1,
		pageSize = 10,
		status: 'accepted' | 'declined' | 'all' = 'all'
	) =>
		queryOptions({
			queryKey: ["user-requests", userId, page, pageSize, status],
			queryFn: async () => {
				const { data, error } = await supabase.rpc('get_user_requests', {
					user_id: userId,
					page: page,
					page_size: pageSize,
					request_status: status
				});
	
				if (error) {
					console.error("Error fetching user's requests:", error);
					throw new Error(error.message);
				}
	
			
	
				return {
					requests: data,
					totalCount: data.length, // Assuming the RPC returns all matching records
					currentPage: page,
					pageSize: pageSize,
					totalPages: Math.ceil(data.length / pageSize),
				};
			},
		});
		





		export const userNotificationsQueryOptions = (
			userId: string,
			page = 1,
			pageSize = 10
		) =>
			queryOptions({
				queryKey: ["user-notifications", userId, page, pageSize],
				queryFn: async () => {
					const startIndex = (page - 1) * pageSize;
					const endIndex = startIndex + pageSize - 1;
		
					const { data, error, count } = await supabase
						.from("notifications")
						.select("*", { count: "exact" })
						.eq("userId", userId)
						.order("createdAt", { ascending: false })
						.range(startIndex, endIndex);
		
					if (error) {
						console.error("Error fetching user notifications:", error);
						throw new Error(error.message);
					}
		
					return {
						notifications: data as Database["public"]["Tables"]["notifications"]["Row"][],
						totalCount: count ?? 0,
						currentPage: page,
						pageSize: pageSize,
						totalPages: Math.ceil((count ?? 0) / pageSize),
					};
				},
			});
		