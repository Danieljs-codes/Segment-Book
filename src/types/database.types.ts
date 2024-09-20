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
      books: {
        Row: {
          author: string
          createdAt: string
          description: string | null
          id: string
          isDonated: boolean
          ownerId: string
          title: string
        }
        Insert: {
          author: string
          createdAt?: string
          description?: string | null
          id?: string
          isDonated?: boolean
          ownerId: string
          title: string
        }
        Update: {
          author?: string
          createdAt?: string
          description?: string | null
          id?: string
          isDonated?: boolean
          ownerId?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_ownerId_fkey"
            columns: ["ownerId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          id: string
          isRead: boolean
          receiverId: string
          senderId: string
          title: string
        }
        Insert: {
          content: string
          createdAt?: string
          id?: string
          isRead?: boolean
          receiverId: string
          senderId: string
          title: string
        }
        Update: {
          content?: string
          createdAt?: string
          id?: string
          isRead?: boolean
          receiverId?: string
          senderId?: string
          title?: string
        }
        Relationships: [
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
          createdAt: string | null
          email: string
          id: string
          name: string
        }
        Insert: {
          authUserId: string
          createdAt?: string | null
          email: string
          id?: string
          name: string
        }
        Update: {
          authUserId?: string
          createdAt?: string | null
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
      get_user_chats: {
        Args: {
          user_id: string
        }
        Returns: {
          id: string
          created_at: string
          requester_id: string
          donor_id: string
          other_user_name: string
          last_message: string
          other_user_id: string
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
    }
    Enums: {
      NotificationType: "DONATION_REQUEST"
      RequestStatus: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED"
    }
    CompositeTypes: {
      [_ in never]: never
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
