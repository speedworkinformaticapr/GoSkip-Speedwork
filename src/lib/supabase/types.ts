// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          id: string
          notes: string | null
          service_id: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          created_at?: string
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          created_at?: string
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'appointments_service_id_fkey'
            columns: ['service_id']
            isOneToOne: false
            referencedRelation: 'services'
            referencedColumns: ['id']
          },
        ]
      }
      athlete_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      athletes: {
        Row: {
          category_id: string | null
          club_id: string | null
          created_at: string
          id: string
          profile_id: string | null
          ranking_points: number | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          club_id?: string | null
          created_at?: string
          id?: string
          profile_id?: string | null
          ranking_points?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          club_id?: string | null
          created_at?: string
          id?: string
          profile_id?: string | null
          ranking_points?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'athletes_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'athlete_categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'athletes_club_id_fkey'
            columns: ['club_id']
            isOneToOne: false
            referencedRelation: 'clubs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'athletes_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          published: boolean | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'blog_posts_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      clubs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string | null
          slug: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id?: string | null
          slug?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          slug?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'clubs_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          holes: number | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          par: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          holes?: number | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          par?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          holes?: number | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          par?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          title?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          payment_intent_id: string | null
          shipping_address: Json | null
          status: string | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          payment_intent_id?: string | null
          shipping_address?: Json | null
          status?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          payment_intent_id?: string | null
          shipping_address?: Json | null
          status?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          published: boolean | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: string
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          group_id: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          slug: string | null
          stock: number
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          group_id?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number
          slug?: string | null
          stock?: number
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          group_id?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          slug?: string | null
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'products_group_id_fkey'
            columns: ['group_id']
            isOneToOne: false
            referencedRelation: 'product_groups'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          document: string | null
          email: string
          id: string
          name: string | null
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          document?: string | null
          email: string
          id: string
          name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          document?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          created_at: string
          details: string | null
          estimated_price: number | null
          id: string
          service_id: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: string | null
          estimated_price?: number | null
          id?: string
          service_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: string | null
          estimated_price?: number | null
          id?: string
          service_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'quotes_service_id_fkey'
            columns: ['service_id']
            isOneToOne: false
            referencedRelation: 'services'
            referencedColumns: ['id']
          },
        ]
      }
      rules: {
        Row: {
          content: string | null
          created_at: string
          id: string
          order_index: number | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          order_index?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          order_index?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          course_id: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          registration_fee: number | null
          slug: string | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          registration_fee?: number | null
          slug?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          registration_fee?: number | null
          slug?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tournaments_course_id_fkey'
            columns: ['course_id']
            isOneToOne: false
            referencedRelation: 'courses'
            referencedColumns: ['id']
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: appointments
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   service_id: uuid (nullable)
//   appointment_date: timestamp with time zone (not null)
//   status: text (nullable, default: 'scheduled'::text)
//   notes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: athlete_categories
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   description: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: athletes
//   id: uuid (not null, default: gen_random_uuid())
//   profile_id: uuid (nullable)
//   club_id: uuid (nullable)
//   category_id: uuid (nullable)
//   ranking_points: integer (nullable, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: blog_posts
//   id: uuid (not null, default: gen_random_uuid())
//   title: text (not null)
//   slug: text (not null)
//   content: text (nullable)
//   excerpt: text (nullable)
//   image_url: text (nullable)
//   author_id: uuid (nullable)
//   published: boolean (nullable, default: false)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: clubs
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   slug: text (nullable)
//   logo_url: text (nullable)
//   description: text (nullable)
//   owner_id: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: courses
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   location: text (nullable)
//   holes: integer (nullable, default: 18)
//   par: integer (nullable, default: 72)
//   image_url: text (nullable)
//   description: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: gallery
//   id: uuid (not null, default: gen_random_uuid())
//   title: text (not null)
//   image_url: text (not null)
//   description: text (nullable)
//   category: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: order_items
//   id: uuid (not null, default: gen_random_uuid())
//   order_id: uuid (nullable)
//   product_id: uuid (nullable)
//   quantity: integer (not null, default: 1)
//   price: numeric (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: orders
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   status: text (nullable, default: 'pending'::text)
//   total_amount: numeric (not null, default: 0)
//   payment_intent_id: text (nullable)
//   shipping_address: jsonb (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: pages
//   id: uuid (not null, default: gen_random_uuid())
//   slug: text (not null)
//   title: text (not null)
//   content: jsonb (nullable, default: '{}'::jsonb)
//   published: boolean (nullable, default: false)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: product_groups
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   slug: text (nullable)
//   description: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: products
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   slug: text (nullable)
//   description: text (nullable)
//   price: numeric (not null, default: 0)
//   stock: integer (not null, default: 0)
//   group_id: uuid (nullable)
//   image_url: text (nullable)
//   active: boolean (nullable, default: true)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: profiles
//   id: uuid (not null)
//   email: text (not null)
//   name: text (nullable)
//   role: text (nullable, default: 'client'::text)
//   phone: text (nullable)
//   document: text (nullable)
//   avatar_url: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: quotes
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   service_id: uuid (nullable)
//   status: text (nullable, default: 'pending'::text)
//   details: text (nullable)
//   estimated_price: numeric (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: rules
//   id: uuid (not null, default: gen_random_uuid())
//   title: text (not null)
//   content: text (nullable)
//   order_index: integer (nullable, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: services
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   description: text (nullable)
//   duration_minutes: integer (nullable, default: 60)
//   price: numeric (nullable, default: 0)
//   active: boolean (nullable, default: true)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: tournaments
//   id: uuid (not null, default: gen_random_uuid())
//   title: text (not null)
//   slug: text (nullable)
//   description: text (nullable)
//   course_id: uuid (nullable)
//   start_date: timestamp with time zone (nullable)
//   end_date: timestamp with time zone (nullable)
//   status: text (nullable, default: 'draft'::text)
//   registration_fee: numeric (nullable, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: appointments
//   PRIMARY KEY appointments_pkey: PRIMARY KEY (id)
//   FOREIGN KEY appointments_service_id_fkey: FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
//   FOREIGN KEY appointments_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: athlete_categories
//   PRIMARY KEY athlete_categories_pkey: PRIMARY KEY (id)
// Table: athletes
//   FOREIGN KEY athletes_category_id_fkey: FOREIGN KEY (category_id) REFERENCES athlete_categories(id) ON DELETE SET NULL
//   FOREIGN KEY athletes_club_id_fkey: FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
//   PRIMARY KEY athletes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY athletes_profile_id_fkey: FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
//   UNIQUE athletes_profile_id_key: UNIQUE (profile_id)
// Table: blog_posts
//   FOREIGN KEY blog_posts_author_id_fkey: FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE SET NULL
//   PRIMARY KEY blog_posts_pkey: PRIMARY KEY (id)
//   UNIQUE blog_posts_slug_key: UNIQUE (slug)
// Table: clubs
//   FOREIGN KEY clubs_owner_id_fkey: FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE SET NULL
//   PRIMARY KEY clubs_pkey: PRIMARY KEY (id)
//   UNIQUE clubs_slug_key: UNIQUE (slug)
// Table: courses
//   PRIMARY KEY courses_pkey: PRIMARY KEY (id)
// Table: gallery
//   PRIMARY KEY gallery_pkey: PRIMARY KEY (id)
// Table: order_items
//   FOREIGN KEY order_items_order_id_fkey: FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
//   PRIMARY KEY order_items_pkey: PRIMARY KEY (id)
//   FOREIGN KEY order_items_product_id_fkey: FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
// Table: orders
//   PRIMARY KEY orders_pkey: PRIMARY KEY (id)
//   FOREIGN KEY orders_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: pages
//   PRIMARY KEY pages_pkey: PRIMARY KEY (id)
//   UNIQUE pages_slug_key: UNIQUE (slug)
// Table: product_groups
//   PRIMARY KEY product_groups_pkey: PRIMARY KEY (id)
//   UNIQUE product_groups_slug_key: UNIQUE (slug)
// Table: products
//   FOREIGN KEY products_group_id_fkey: FOREIGN KEY (group_id) REFERENCES product_groups(id) ON DELETE SET NULL
//   PRIMARY KEY products_pkey: PRIMARY KEY (id)
//   UNIQUE products_slug_key: UNIQUE (slug)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: quotes
//   PRIMARY KEY quotes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY quotes_service_id_fkey: FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
//   FOREIGN KEY quotes_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: rules
//   PRIMARY KEY rules_pkey: PRIMARY KEY (id)
// Table: services
//   PRIMARY KEY services_pkey: PRIMARY KEY (id)
// Table: tournaments
//   FOREIGN KEY tournaments_course_id_fkey: FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
//   PRIMARY KEY tournaments_pkey: PRIMARY KEY (id)
//   UNIQUE tournaments_slug_key: UNIQUE (slug)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: appointments
//   Policy "Admin can manage appointments" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Users can manage their own appointments" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: athlete_categories
//   Policy "Admin can manage athlete_categories" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Public can view athlete_categories" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: athletes
//   Policy "Admin can manage athletes" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Public can view athletes" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: blog_posts
//   Policy "Admin can manage blog_posts" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Public can view blog_posts" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: clubs
//   Policy "Admin can manage clubs" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Public can view clubs" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: courses
//   Policy "Admin can manage courses" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Public can view courses" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: gallery
//   Policy "Admin can manage gallery" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Public can view gallery" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: order_items
//   Policy "Admin can manage order items" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Users can view their order items" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM orders   WHERE ((orders.id = order_items.order_id) AND (orders.user_id = auth.uid()))))
// Table: orders
//   Policy "Admin can manage orders" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Users can manage their own orders" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: pages
//   Policy "Admin can manage pages" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Public can view pages" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: product_groups
//   Policy "Admin can manage product_groups" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Public can view product_groups" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: products
//   Policy "Admin can manage products" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Public can view products" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: profiles
//   Policy "Admins can delete profiles." (DELETE, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles profiles_1   WHERE ((profiles_1.id = auth.uid()) AND (profiles_1.role = 'admin'::text))))
//   Policy "Admins can update all profiles." (UPDATE, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles profiles_1   WHERE ((profiles_1.id = auth.uid()) AND (profiles_1.role = 'admin'::text))))
//   Policy "Public profiles are viewable by everyone." (SELECT, PERMISSIVE) roles={public}
//     USING: true
//   Policy "Users can insert their own profile." (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() = id)
//   Policy "Users can update own profile." (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = id)
// Table: quotes
//   Policy "Admin can manage quotes" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Users can manage their own quotes" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: rules
//   Policy "Admin can manage rules" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Public can view rules" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: services
//   Policy "Admin can manage services" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Public can view services" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: tournaments
//   Policy "Admin can manage tournaments" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Public can view tournaments" (SELECT, PERMISSIVE) roles={public}
//     USING: true

// --- DATABASE FUNCTIONS ---
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.profiles (id, email, name, role)
//     VALUES (
//       NEW.id,
//       NEW.email,
//       COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
//       COALESCE(NEW.raw_user_meta_data->>'role', 'client')
//     )
//     ON CONFLICT (id) DO UPDATE SET
//       email = EXCLUDED.email;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION rls_auto_enable()
//   CREATE OR REPLACE FUNCTION public.rls_auto_enable()
//    RETURNS event_trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'pg_catalog'
//   AS $function$
//   DECLARE
//     cmd record;
//   BEGIN
//     FOR cmd IN
//       SELECT *
//       FROM pg_event_trigger_ddl_commands()
//       WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
//         AND object_type IN ('table','partitioned table')
//     LOOP
//        IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
//         BEGIN
//           EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
//           RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
//         EXCEPTION
//           WHEN OTHERS THEN
//             RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
//         END;
//        ELSE
//           RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
//        END IF;
//     END LOOP;
//   END;
//   $function$
//

// --- INDEXES ---
// Table: athletes
//   CREATE UNIQUE INDEX athletes_profile_id_key ON public.athletes USING btree (profile_id)
// Table: blog_posts
//   CREATE UNIQUE INDEX blog_posts_slug_key ON public.blog_posts USING btree (slug)
// Table: clubs
//   CREATE UNIQUE INDEX clubs_slug_key ON public.clubs USING btree (slug)
// Table: pages
//   CREATE UNIQUE INDEX pages_slug_key ON public.pages USING btree (slug)
// Table: product_groups
//   CREATE UNIQUE INDEX product_groups_slug_key ON public.product_groups USING btree (slug)
// Table: products
//   CREATE UNIQUE INDEX products_slug_key ON public.products USING btree (slug)
// Table: tournaments
//   CREATE UNIQUE INDEX tournaments_slug_key ON public.tournaments USING btree (slug)
