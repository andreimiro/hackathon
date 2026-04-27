export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_id: string
          name: string
          email: string
          github_repo: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          name?: string
          email?: string
          github_repo: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          name?: string
          email?: string
          github_repo?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
