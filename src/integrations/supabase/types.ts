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
          available: boolean | null
          category: string | null
          cover_image: string | null
          created_at: string | null
          id: string
          isbn: string | null
          shelf_location: string | null
          title: string
        }
        Insert: {
          author: string
          available?: boolean | null
          category?: string | null
          cover_image?: string | null
          created_at?: string | null
          id?: string
          isbn?: string | null
          shelf_location?: string | null
          title: string
        }
        Update: {
          author?: string
          available?: boolean | null
          category?: string | null
          cover_image?: string | null
          created_at?: string | null
          id?: string
          isbn?: string | null
          shelf_location?: string | null
          title?: string
        }
        Relationships: []
      }
      borrowed_books: {
        Row: {
          book_id: string | null
          borrow_date: string | null
          due_date: string
          id: string
          member_id: string | null
          return_date: string | null
          status: string | null
        }
        Insert: {
          book_id?: string | null
          borrow_date?: string | null
          due_date: string
          id?: string
          member_id?: string | null
          return_date?: string | null
          status?: string | null
        }
        Update: {
          book_id?: string | null
          borrow_date?: string | null
          due_date?: string
          id?: string
          member_id?: string | null
          return_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "borrowed_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "borrowed_books_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      library_visitors: {
        Row: {
          borrower_count: number | null
          id: string
          visit_date: string
          visitor_count: number
        }
        Insert: {
          borrower_count?: number | null
          id?: string
          visit_date: string
          visitor_count?: number
        }
        Update: {
          borrower_count?: number | null
          id?: string
          visit_date?: string
          visitor_count?: number
        }
        Relationships: []
      }
      members: {
        Row: {
          avatar: string | null
          email: string
          id: string
          joined_at: string | null
          name: string
          role: string | null
        }
        Insert: {
          avatar?: string | null
          email: string
          id?: string
          joined_at?: string | null
          name: string
          role?: string | null
        }
        Update: {
          avatar?: string | null
          email?: string
          id?: string
          joined_at?: string | null
          name?: string
          role?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          bio: string | null
          date_of_birth: string | null
          id: string
          phone_number: string | null
          preferences: Json | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          date_of_birth?: string | null
          id: string
          phone_number?: string | null
          preferences?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          date_of_birth?: string | null
          id?: string
          phone_number?: string | null
          preferences?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      requested_books: {
        Row: {
          book_id: string | null
          id: string
          member_id: string | null
          request_date: string | null
          status: string | null
        }
        Insert: {
          book_id?: string | null
          id?: string
          member_id?: string | null
          request_date?: string | null
          status?: string | null
        }
        Update: {
          book_id?: string | null
          id?: string
          member_id?: string | null
          request_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requested_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requested_books_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
