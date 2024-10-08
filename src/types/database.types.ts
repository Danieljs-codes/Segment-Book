export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      book_categories: {
        Row: {
          book_id: string
          category_id: string
        }
        Insert: {
          book_id: string
          category_id: string
        }
        Update: {
          book_id?: string
          category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_categories_book_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_categories_category_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string
          condition: string
          createdAt: string
          description: string | null
          donatedToId: string | null
          id: string
          image_url: string
          isDonated: boolean
          language: string
          ownerId: string
          title: string
          updatedAt: string
        }
        Insert: {
          author: string
          condition: string
          createdAt?: string
          description?: string | null
          donatedToId?: string | null
          id?: string
          image_url: string
          isDonated?: boolean
          language: string
          ownerId: string
          title: string
          updatedAt?: string
        }
        Update: {
          author?: string
          condition?: string
          createdAt?: string
          description?: string | null
          donatedToId?: string | null
          id?: string
          image_url?: string
          isDonated?: boolean
          language?: string
          ownerId?: string
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_donatedtoid_fkey"
            columns: ["donatedToId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_ownerId_fkey"
            columns: ["ownerId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      chats: {
        Row: {
          created_at: string | null
          donation_request_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          donation_request_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          donation_request_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_donation_request_id_fkey"
            columns: ["donation_request_id"]
            isOneToOne: false
            referencedRelation: "donation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_requests: {
        Row: {
          bookId: string
          createdAt: string
          donorId: string
          id: string
          requesterId: string
          status: Database["public"]["Enums"]["RequestStatus"]
          updatedAt: string
        }
        Insert: {
          bookId: string
          createdAt?: string
          donorId: string
          id?: string
          requesterId: string
          status?: Database["public"]["Enums"]["RequestStatus"]
          updatedAt: string
        }
        Update: {
          bookId?: string
          createdAt?: string
          donorId?: string
          id?: string
          requesterId?: string
          status?: Database["public"]["Enums"]["RequestStatus"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "donation_requests_bookId_fkey"
            columns: ["bookId"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_requests_donorId_fkey"
            columns: ["donorId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_requests_requesterId_fkey"
            columns: ["requesterId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: string | null
          content: string
          createdAt: string
          id: string
          senderId: string
        }
        Insert: {
          chat_id?: string | null
          content: string
          createdAt?: string
          id?: string
          senderId: string
        }
        Update: {
          chat_id?: string | null
          content?: string
          createdAt?: string
          id?: string
          senderId?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_senderId_fkey"
            columns: ["senderId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          createdAt: string
          donation_request_id: string | null
          id: string
          isRead: boolean
          receiverId: string
          senderId: string
          title: string
          type: Database["public"]["Enums"]["notificationtype"]
          updatedAt: string
        }
        Insert: {
          content: string
          createdAt?: string
          donation_request_id?: string | null
          id?: string
          isRead?: boolean
          receiverId: string
          senderId: string
          title: string
          type?: Database["public"]["Enums"]["notificationtype"]
          updatedAt?: string
        }
        Update: {
          content?: string
          createdAt?: string
          donation_request_id?: string | null
          id?: string
          isRead?: boolean
          receiverId?: string
          senderId?: string
          title?: string
          type?: Database["public"]["Enums"]["notificationtype"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_donation_request_id_fkey"
            columns: ["donation_request_id"]
            isOneToOne: false
            referencedRelation: "donation_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_receiverid_fkey"
            columns: ["receiverId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_senderid_fkey"
            columns: ["senderId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          authUserId: string
          avatar: string | null
          createdAt: string
          email: string
          id: string
          name: string
          username: string
        }
        Insert: {
          authUserId: string
          avatar?: string | null
          createdAt?: string
          email: string
          id?: string
          name: string
          username: string
        }
        Update: {
          authUserId?: string
          avatar?: string | null
          createdAt?: string
          email?: string
          id?: string
          name?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_donation_request_with_chat:
        | {
            Args: {
              request_id: string
            }
            Returns: undefined
          }
        | {
            Args: {
              request_id: string
              current_user_id: string
            }
            Returns: undefined
          }
      create_book: {
        Args: {
          book_data: Json
        }
        Returns: string
      }
      create_notification: {
        Args: {
          sender_id: string
          receiver_id: string
          title: string
          content: string
          donation_id: string
        }
        Returns: string
      }
      get_active_requests_received: {
        Args: {
          user_id: string
        }
        Returns: {
          donation_request_id: string
          book_title: string
          book_author: string
          requester_name: string
          request_date: string
          status: string
        }[]
      }
      get_active_requests_sent: {
        Args: {
          user_id: string
        }
        Returns: {
          donation_request_id: string
          book_title: string
          book_author: string
          donor_name: string
          request_date: string
          status: string
        }[]
      }
      get_chat_messages: {
        Args: {
          p_chat_id: string
        }
        Returns: {
          message_id: string
          content: string
          message_created_at: string
          sender_id: string
          sender_name: string
          sender_username: string
          recipient_id: string
          recipient_name: string
          recipient_username: string
        }[]
      }
      get_chat_participants: {
        Args: {
          p_chat_id: string
          p_current_user_id: string
        }
        Returns: {
          current_user_id: string
          current_user_name: string
          current_user_username: string
          current_user_avatar: string
          other_user_id: string
          other_user_name: string
          other_user_username: string
          other_user_avatar: string
        }[]
      }
      get_user_chats: {
        Args: {
          user_id: string
        }
        Returns: {
          id: string
          donation_request_id: string
          donation_request: Database["public"]["CompositeTypes"]["donation_request_type"]
          messages: Database["public"]["CompositeTypes"]["message_type"][]
          book: Database["public"]["CompositeTypes"]["book_type"]
          requester: Database["public"]["CompositeTypes"]["user_type"]
          donor: Database["public"]["CompositeTypes"]["user_type"]
        }[]
      }
      get_user_notifications: {
        Args: {
          user_id: string
          page_number?: number
          page_size?: number
          status?: string
        }
        Returns: Json
      }
      get_user_requests: {
        Args: {
          user_id: string
          page?: number
          page_size?: number
          request_status?: string
        }
        Returns: {
          id: string
          status: Database["public"]["Enums"]["RequestStatus"]
          created_at: string
          book_title: string
          book_author: string
          donor_id: string
          donor_name: string
          total_count: number
        }[]
      }
      mark_book_as_donated: {
        Args: {
          book_id: string
          donor_username: string
          recipient_username: string
        }
        Returns: undefined
      }
      request_book: {
        Args: {
          book_id: string
          requester_id: string
          donor_id: string
        }
        Returns: string
      }
    }
    Enums: {
      notificationtype: "book_request" | "other"
      NotificationType: "DONATION_REQUEST"
      RequestStatus: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED"
    }
    CompositeTypes: {
      book_type: {
        id: string | null
        title: string | null
        author: string | null
      }
      chat_message_v2: {
        id: string | null
        content: string | null
        created_at: string | null
        sender_id: string | null
        sender_name: string | null
        sender_username: string | null
      }
      donation_request_type: {
        id: string | null
        bookId: string | null
        requesterId: string | null
        donorId: string | null
        status: string | null
      }
      message_type: {
        id: string | null
        content: string | null
        createdAt: string | null
        senderId: string | null
      }
      user_type: {
        id: string | null
        name: string | null
        email: string | null
        username: string | null
        avatar: string | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
