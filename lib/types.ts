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
      admin: {
        Row: {
          delete: boolean | null
          id: string
          read: boolean | null
          sales_id: string | null
          write: boolean | null
        }
        Insert: {
          delete?: boolean | null
          id: string
          read?: boolean | null
          sales_id?: string | null
          write?: boolean | null
        }
        Update: {
          delete?: boolean | null
          id?: string
          read?: boolean | null
          sales_id?: string | null
          write?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_id_fkey1"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      claim: {
        Row: {
          date_submitted: string
          diagnostics: string | null
          failed_date: string | null
          id: string
          install_date: string | null
          invoice_number: string
          labor_hours: number | null
          make: string | null
          mileage_failed: number | null
          mileage_installed: number | null
          model: string | null
          part_desc: string | null
          part_number: string | null
          price: number
          qty: number
          rga_id: string | null
          serial: string | null
          shipment_id: string | null
          symptoms: string | null
          vin: string | null
          year: number | null
        }
        Insert: {
          date_submitted?: string
          diagnostics?: string | null
          failed_date?: string | null
          id?: string
          install_date?: string | null
          invoice_number: string
          labor_hours?: number | null
          make?: string | null
          mileage_failed?: number | null
          mileage_installed?: number | null
          model?: string | null
          part_desc?: string | null
          part_number?: string | null
          price: number
          qty: number
          rga_id?: string | null
          serial?: string | null
          shipment_id?: string | null
          symptoms?: string | null
          vin?: string | null
          year?: number | null
        }
        Update: {
          date_submitted?: string
          diagnostics?: string | null
          failed_date?: string | null
          id?: string
          install_date?: string | null
          invoice_number?: string
          labor_hours?: number | null
          make?: string | null
          mileage_failed?: number | null
          mileage_installed?: number | null
          model?: string | null
          part_desc?: string | null
          part_number?: string | null
          price?: number
          qty?: number
          rga_id?: string | null
          serial?: string | null
          shipment_id?: string | null
          symptoms?: string | null
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_claim_rga_id_fkey"
            columns: ["rga_id"]
            isOneToOne: false
            referencedRelation: "rga"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_claim_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipment"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          account_number: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
        }
        Insert: {
          account_number?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
        }
        Update: {
          account_number?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rga: {
        Row: {
          amount_credited: number | null
          created_at: string
          date_credited: string | null
          id: string
          rga_number: string | null
          tracking_number: string | null
          vendor_response: string | null
        }
        Insert: {
          amount_credited?: number | null
          created_at?: string
          date_credited?: string | null
          id?: string
          rga_number?: string | null
          tracking_number?: string | null
          vendor_response?: string | null
        }
        Update: {
          amount_credited?: number | null
          created_at?: string
          date_credited?: string | null
          id?: string
          rga_number?: string | null
          tracking_number?: string | null
          vendor_response?: string | null
        }
        Relationships: []
      }
      shipment: {
        Row: {
          carrier: string | null
          delivery_date: string | null
          drop_off: boolean | null
          estimated_delivery_date: string | null
          height: number | null
          id: string
          length: number | null
          tracking_number: string | null
          weight: number | null
          width: number | null
        }
        Insert: {
          carrier?: string | null
          delivery_date?: string | null
          drop_off?: boolean | null
          estimated_delivery_date?: string | null
          height?: number | null
          id?: string
          length?: number | null
          tracking_number?: string | null
          weight?: number | null
          width?: number | null
        }
        Update: {
          carrier?: string | null
          delivery_date?: string | null
          drop_off?: boolean | null
          estimated_delivery_date?: string | null
          height?: number | null
          id?: string
          length?: number | null
          tracking_number?: string | null
          weight?: number | null
          width?: number | null
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


// All of the above is from supabase CLI
export type ReadClaim = {
    date_submitted: string
    diagnostics: string | null
    failed_date: string | null
    id: string
    install_date: string | null
    invoice_number: string
    labor_hours: number | null
    make: string | null
    mileage_failed: number | null
    mileage_installed: number | null
    model: string | null
    part_desc: string | null
    part_number: string | null
    price: number
    qty: number
    rga_id: string | null
    serial: string | null
    shipment_id: string | null
    symptoms: string | null
    vin: string | null
    year: number | null
}

export type ClaimCardType = {
    invoice_number: string
    date_submitted: string
    qty: number
    price: number
    profile: {
        name: string
    }
    part_number: string
    rga?: {
        rga_number: string
    }
    shipment?: string
    id: string
}