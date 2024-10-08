import { queryOptions } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
				.from("books")
				.select("id, title, author")
				.eq("donatedToId", userId);

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
	status: "donated" | "not donated" | "all" | "notDonated" = "all",
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

			if (status === "donated") {
				query = query.eq("isDonated", true);
			} else if (status === "not donated" || status === "notDonated") {
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
	status: "accepted" | "rejected" | "all" = "all",
) =>
	queryOptions({
		queryKey: ["user-requests", userId, page, pageSize, status],
		queryFn: async () => {
			const startIndex = (page - 1) * pageSize;
			const endIndex = startIndex + pageSize - 1;

			let query = supabase
				.from("donation_requests")
				.select(
					`
					*,
					book:books (
						id,
						title,
						author
					),
					donor:users!donation_requests_donorId_fkey (
						id,
						name
					)
				`,
					{ count: "exact" },
				)
				.eq("requesterId", userId)
				.order("createdAt", { ascending: false });

			if (status !== "all") {
				query = query.eq("status", status.toUpperCase());
			}

			const { data, error, count } = await query.range(startIndex, endIndex);

			if (error) {
				console.error("Error fetching user's requests:", error);
				throw new Error(error.message);
			}

			return {
				requests: data ?? [],
				totalCount: count ?? 0,
				currentPage: page,
				pageSize: pageSize,
				totalPages: Math.ceil((count ?? 0) / pageSize),
			};
		},
	});

export const userNotificationsQueryOptions = (
	userId: string,
	page = 1,
	pageSize = 10,
	status: "all" | "unread" = "all",
) =>
	queryOptions({
		queryKey: ["user-notifications", userId, page, pageSize, status],
		queryFn: async () => {
			const startIndex = (page - 1) * pageSize;
			const endIndex = startIndex + pageSize - 1;

			let query = supabase
				.from("notifications")
				.select(
					`
					*,
					user:users!notifications_senderid_fkey (
						id,
						name,
						email,
						avatar
					),
					donation_request:donation_requests (
						status
					)
					`,
					{ count: "exact" },
				)
				.eq("receiverId", userId)
				.order("createdAt", { ascending: false });

			if (status === "unread") {
				query = query.eq("isRead", false);
			}

			const { data, error, count } = await query.range(startIndex, endIndex);

			if (error) {
				console.error("Error fetching user notifications:", error);
				throw new Error(error.message);
			}

			return {
				notifications: data,
				totalCount: count ?? 0,
				currentPage: page,
				pageSize: pageSize,
				totalPages: Math.ceil((count ?? 0) / pageSize),
			};
		},
	});

export const userChatsQueryOptions = ({ userId }: { userId: string }) =>
	queryOptions({
		queryKey: ["user-chats", userId],
		queryFn: async () => {
			const { data, error } = await supabase.rpc("get_user_chats", {
				user_id: userId,
			});

			if (error) {
				console.error("Error fetching user chats:", error);
				throw new Error(error.message);
			}

			return data;
		},
	});

export const chatMessagesQueryOptions = (chatId: string) => ({
	queryKey: ["chatMessages", chatId],
	queryFn: async () => {
		const { data, error } = await supabase.rpc("get_chat_messages", {
			p_chat_id: chatId,
		});

		if (error) {
			console.error("Error fetching chat messages:", error);
			throw new Error(error.message);
		}

		return data;
	},
});

export const getChatParticipantsQueryOptions = (
	chatId: string,
	userId: string,
) =>
	queryOptions({
		queryKey: ["chat-participants", chatId, userId],
		queryFn: async () => {
			const { data, error } = await supabase.rpc("get_chat_participants", {
				p_chat_id: chatId,
				p_current_user_id: userId,
			});

			if (error) {
				console.error("Error fetching chat participants:", error);
				throw new Error(error.message);
			}

			return data;
		},
	});

export const bookFiltersQueryOptions = () =>
	queryOptions({
		queryKey: ["book-filters"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("books")
				.select(
					`
					*,
					donor:users!books_ownerId_fkey(id, name),
					requests:donation_requests(id, status)
				`,
					{
						count: "exact",
					},
				)
				.eq("isDonated", false)
				.order("createdAt", { ascending: false });

			if (error) {
				console.error("Error fetching book filters:", error);
				throw new Error(error.message);
			}

			// Filter books with no pending or accepted requests
			const filteredData = data?.filter(
				(book) =>
					!book.requests.some(
						(request) =>
							request.status === "PENDING" || request.status === "ACCEPTED",
					),
			);

			return filteredData;
		},
	});

export const bookQueryOptions = (bookId: string) =>
	queryOptions({
		queryKey: ["book", bookId],
		queryFn: async () => {},
	});

export function bookByIdQueryOptions(bookId: string) {
	return {
		queryKey: ["book", bookId],
		queryFn: async () => {
			if (!bookId) return null;
			const { data, error } = await supabase
				.from("books")
				.select(`
        *,
        donor:users!books_ownerId_fkey(id, name),
        book_categories (
            category:categories(id, name)
        )
    `)
				.eq("id", bookId)
				.limit(1)
				.single();

			if (error) {
				console.error("Error fetching book:", error);
				throw new Error(error.message);
			}

			return data;
		},
		enabled: !!bookId,
	};
}

export const allDonorsQueryOptions = () =>
	queryOptions({
		queryKey: ["all-donors"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("users")
				.select(`
					*,
					donated_books:books!books_ownerId_fkey(count)
				`)
				.eq("books.isDonated", true);

			if (error) {
				console.error("Error fetching all donors:", error);
				throw new Error(error.message);
			}

			const sortedData = data.sort(
				(a, b) =>
					(b.donated_books[0]?.count || 0) - (a.donated_books[0]?.count || 0),
			);

			return sortedData.map((donor) => ({
				...donor,
				donated_books: donor.donated_books[0]?.count || 0,
			}));
		},
	});

export const donorsByIdQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["donors-by-id", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("users")
				.select(`
					*,
					books:books!books_ownerId_fkey(*)
				`)
				.eq("id", userId)
				.limit(1)
				.single();

			if (error) {
				console.error("Error fetching donors by id:", error);
				throw new Error(error.message);
			}

			return data;
		},
	});

export const listedAndDonatedQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["listed-and-donated", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("books")
				.select(
					"id, title, author, description, isDonated, language, condition",
				)
				.eq("ownerId", userId)
				.eq("isDonated", true)
				.limit(10);

			if (error) {
				console.error("Error fetching listed and donated books:", error);
				throw new Error(error.message);
			}

			return data;
		},
	});
