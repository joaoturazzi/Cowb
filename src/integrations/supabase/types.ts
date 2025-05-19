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
      challenge_participants: {
        Row: {
          challenge_id: string
          created_at: string
          id: string
          progress: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string
          id?: string
          progress?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string
          id?: string
          progress?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "shared_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          habit_id: string
          id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date?: string
          habit_id: string
          id?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          habit_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          active: boolean
          color: string
          created_at: string
          description: string | null
          frequency_days: number[] | null
          frequency_type: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          active?: boolean
          color?: string
          created_at?: string
          description?: string | null
          frequency_days?: number[] | null
          frequency_type?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          active?: boolean
          color?: string
          created_at?: string
          description?: string | null
          frequency_days?: number[] | null
          frequency_type?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      pomodoro_sessions: {
        Row: {
          actual_duration: number | null
          created_at: string
          end_time: string | null
          id: string
          planned_duration: number
          session_type: string
          start_time: string
          status: string
          task_id: string | null
          user_id: string
        }
        Insert: {
          actual_duration?: number | null
          created_at?: string
          end_time?: string | null
          id?: string
          planned_duration: number
          session_type: string
          start_time?: string
          status?: string
          task_id?: string | null
          user_id: string
        }
        Update: {
          actual_duration?: number | null
          created_at?: string
          end_time?: string | null
          id?: string
          planned_duration?: number
          session_type?: string
          start_time?: string
          status?: string
          task_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pomodoro_sessions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          id: string
          level: number | null
          total_points: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string | null
          id: string
          level?: number | null
          total_points?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string
          level?: number | null
          total_points?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      shared_challenges: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          end_date: string | null
          goal: number
          id: string
          reward_details: Json | null
          reward_type: string | null
          start_date: string
          status: string
          team_id: string | null
          title: string
          type: string
          updated_at: string
          wager: string | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          end_date?: string | null
          goal: number
          id?: string
          reward_details?: Json | null
          reward_type?: string | null
          start_date?: string
          status?: string
          team_id?: string | null
          title: string
          type: string
          updated_at?: string
          wager?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          end_date?: string | null
          goal?: number
          id?: string
          reward_details?: Json | null
          reward_type?: string | null
          start_date?: string
          status?: string
          team_id?: string | null
          title?: string
          type?: string
          updated_at?: string
          wager?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_challenges_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      task_tags: {
        Row: {
          tag_id: string
          task_id: string
        }
        Insert: {
          tag_id: string
          task_id: string
        }
        Update: {
          tag_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_tags_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed: boolean
          created_at: string
          estimated_time: number
          id: string
          name: string
          parent_task_id: string | null
          priority: string
          recurrence_end_date: string | null
          recurrence_interval: number | null
          recurrence_type: string | null
          target_date: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          estimated_time: number
          id?: string
          name: string
          parent_task_id?: string | null
          priority: string
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_type?: string | null
          target_date?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          estimated_time?: number
          id?: string
          name?: string
          parent_task_id?: string | null
          priority?: string
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_type?: string | null
          target_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      team_habit_logs: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          id: string
          team_habit_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          team_habit_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          team_habit_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_habit_logs_team_habit_id_fkey"
            columns: ["team_habit_id"]
            isOneToOne: false
            referencedRelation: "team_habits"
            referencedColumns: ["id"]
          },
        ]
      }
      team_habits: {
        Row: {
          active: boolean
          color: string
          created_at: string
          creator_id: string
          description: string | null
          frequency_days: number[] | null
          frequency_type: string
          id: string
          name: string
          team_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          color?: string
          created_at?: string
          creator_id: string
          description?: string | null
          frequency_days?: number[] | null
          frequency_type?: string
          id?: string
          name: string
          team_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          color?: string
          created_at?: string
          creator_id?: string
          description?: string | null
          frequency_days?: number[] | null
          frequency_type?: string
          id?: string
          name?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_habits_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          role: string
          status: string
          team_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          status?: string
          team_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          status?: string
          team_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          avatar_url: string | null
          created_at: string
          creator_id: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          audio_settings: Json | null
          created_at: string
          reminder_settings: Json | null
          theme_preference: string | null
          timer_presets: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_settings?: Json | null
          created_at?: string
          reminder_settings?: Json | null
          theme_preference?: string | null
          timer_presets?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_settings?: Json | null
          created_at?: string
          reminder_settings?: Json | null
          theme_preference?: string | null
          timer_presets?: Json | null
          updated_at?: string
          user_id?: string
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
