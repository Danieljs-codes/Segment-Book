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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      books: {
        Row: {
          author: string
          description: string | null
          id: string
          isDonated: boolean
          ownerId: string
          title: string
        }
        Insert: {
          author: string
          description?: string | null
          id?: string
          isDonated?: boolean
          ownerId: string
          title: string
        }
        Update: {
          author?: string
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
          content: string
          createdAt: string
          id: string
          recipientId: string
          senderId: string
        }
        Insert: {
          content: string
          createdAt?: string
          id?: string
          recipientId: string
          senderId: string
        }
        Update: {
          content?: string
          createdAt?: string
          id?: string
          recipientId?: string
          senderId?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipientId_fkey"
            columns: ["recipientId"]
            isOneToOne: false
            referencedRelation: "users"
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
          type: Database["public"]["Enums"]["NotificationType"]
          userId: string
        }
        Insert: {
          content: string
          createdAt?: string
          id?: string
          isRead?: boolean
          type: Database["public"]["Enums"]["NotificationType"]
          userId: string
        }
        Update: {
          content?: string
          createdAt?: string
          id?: string
          isRead?: boolean
          type?: Database["public"]["Enums"]["NotificationType"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          authUserId: string
          email: string
          id: string
          name: string
        }
        Insert: {
          authUserId: string
          email: string
          id?: string
          name: string
        }
        Update: {
          authUserId?: string
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
