export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      trip_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string | null
          description: string | null
          id: string
          trip_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          trip_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          ai_recommendations: Json | null
          budget_feasibility: string | null
          created_at: string
          currency: string | null
          destination: string
          end_date: string | null
          id: string
          start_date: string | null
          status: string | null
          total_budget: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_recommendations?: Json | null
          budget_feasibility?: string | null
          created_at?: string
          currency?: string | null
          destination: string
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          total_budget?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_recommendations?: Json | null
          budget_feasibility?: string | null
          created_at?: string
          currency?: string | null
          destination?: string
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          total_budget?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          trip_id: string | null
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          trip_id?: string | null
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          trip_id?: string | null
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          noise_rating: number | null
          rating: number
          user_id: string
          wifi_rating: number | null
          workspace_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          noise_rating?: number | null
          rating: number
          user_id: string
          wifi_rating?: number | null
          workspace_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          noise_rating?: number | null
          rating?: number
          user_id?: string
          wifi_rating?: number | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_reviews_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_suggestions: {
        Row: {
          address: string | null
          city: string
          country: string
          created_at: string
          description: string | null
          has_power_outlets: boolean | null
          id: string
          name: string
          noise_level_estimate: string | null
          status: string | null
          user_id: string | null
          wifi_speed_estimate: string | null
        }
        Insert: {
          address?: string | null
          city: string
          country: string
          created_at?: string
          description?: string | null
          has_power_outlets?: boolean | null
          id?: string
          name: string
          noise_level_estimate?: string | null
          status?: string | null
          user_id?: string | null
          wifi_speed_estimate?: string | null
        }
        Update: {
          address?: string | null
          city?: string
          country?: string
          created_at?: string
          description?: string | null
          has_power_outlets?: boolean | null
          id?: string
          name?: string
          noise_level_estimate?: string | null
          status?: string | null
          user_id?: string | null
          wifi_speed_estimate?: string | null
        }
        Relationships: []
      }
      workspaces: {
        Row: {
          address: string | null
          amenities: string[] | null
          average_rating: number | null
          city: string
          country: string
          created_at: string
          description: string | null
          has_power_outlets: boolean | null
          has_quiet_zones: boolean | null
          hours_close: string | null
          hours_open: string | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          noise_level: string | null
          open_24_hours: boolean | null
          power_outlet_count: string | null
          region: string | null
          review_count: number | null
          updated_at: string
          website_url: string | null
          wifi_quality: string | null
          wifi_speed_mbps: number | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          average_rating?: number | null
          city: string
          country: string
          created_at?: string
          description?: string | null
          has_power_outlets?: boolean | null
          has_quiet_zones?: boolean | null
          hours_close?: string | null
          hours_open?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          noise_level?: string | null
          open_24_hours?: boolean | null
          power_outlet_count?: string | null
          region?: string | null
          review_count?: number | null
          updated_at?: string
          website_url?: string | null
          wifi_quality?: string | null
          wifi_speed_mbps?: number | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          average_rating?: number | null
          city?: string
          country?: string
          created_at?: string
          description?: string | null
          has_power_outlets?: boolean | null
          has_quiet_zones?: boolean | null
          hours_close?: string | null
          hours_open?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          noise_level?: string | null
          open_24_hours?: boolean | null
          power_outlet_count?: string | null
          region?: string | null
          review_count?: number | null
          updated_at?: string
          website_url?: string | null
          wifi_quality?: string | null
          wifi_speed_mbps?: number | null
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
