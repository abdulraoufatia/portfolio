export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string
          github_url: string
          live_url: string
          tags: string[]
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url: string
          github_url: string
          live_url: string
          tags?: string[]
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string
          github_url?: string
          live_url?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          excerpt: string
          content: string
          image_url: string
          read_time: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          excerpt: string
          content: string
          image_url: string
          read_time: string
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string
          content?: string
          image_url?: string
          read_time?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      experiences: {
        Row: {
          id: string
          company: string
          position: string
          period: string
          description: string
          technologies: string[]
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          company: string
          position: string
          period: string
          description: string
          technologies?: string[]
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          company?: string
          position?: string
          period?: string
          description?: string
          technologies?: string[]
          created_at?: string
          updated_at?: string
          user_id?: string
        }
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
  }
}