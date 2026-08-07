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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      event_checklist: {
        Row: {
          briefing_done: Json
          created_at: string
          event_id: string
          items: Json
          responsavel: string | null
          updated_at: string
        }
        Insert: {
          briefing_done?: Json
          created_at?: string
          event_id: string
          items?: Json
          responsavel?: string | null
          updated_at?: string
        }
        Update: {
          briefing_done?: Json
          created_at?: string
          event_id?: string
          items?: Json
          responsavel?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_checklist_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          atracao: string | null
          bebida_alcoolica: boolean | null
          buffet: string | null
          cerimonial: boolean | null
          coffee_piazza: boolean | null
          contato: string
          convidados_estimados: number | null
          created_at: string
          credenciamento: boolean | null
          data: string
          data_desmontagem: string | null
          data_montagem: string | null
          data_preenchimento: string | null
          decoracao: boolean | null
          desmontagem_inicio: string | null
          desmontagem_termino: string | null
          empresa: string | null
          equipamentos_externos: string | null
          estilo_decoracao: string | null
          gerador: string | null
          horario_inicio: string | null
          horario_montagem: string | null
          horario_servico: string | null
          horario_termino: string | null
          id: string
          iluminacao: string | null
          limpeza_durante: boolean | null
          local_evento: string | null
          microfones: string | null
          montagem_inicio: string | null
          montagem_termino: string | null
          nome_evento: string
          observacoes: string | null
          opcao_coffee: string | null
          pacote: string | null
          painel_fotografia: string | null
          qtd_coffee: number | null
          responsavel: string | null
          responsavel_buffet: string | null
          restricoes_alimentares: boolean | null
          restricoes_obs: string | null
          sonorizacao: string | null
          telao: string | null
          tipo_coffee: string | null
          tipo_evento: string | null
          updated_at: string
          valet: boolean | null
        }
        Insert: {
          atracao?: string | null
          bebida_alcoolica?: boolean | null
          buffet?: string | null
          cerimonial?: boolean | null
          coffee_piazza?: boolean | null
          contato: string
          convidados_estimados?: number | null
          created_at?: string
          credenciamento?: boolean | null
          data: string
          data_desmontagem?: string | null
          data_montagem?: string | null
          data_preenchimento?: string | null
          decoracao?: boolean | null
          desmontagem_inicio?: string | null
          desmontagem_termino?: string | null
          empresa?: string | null
          equipamentos_externos?: string | null
          estilo_decoracao?: string | null
          gerador?: string | null
          horario_inicio?: string | null
          horario_montagem?: string | null
          horario_servico?: string | null
          horario_termino?: string | null
          id?: string
          iluminacao?: string | null
          limpeza_durante?: boolean | null
          local_evento?: string | null
          microfones?: string | null
          montagem_inicio?: string | null
          montagem_termino?: string | null
          nome_evento: string
          observacoes?: string | null
          opcao_coffee?: string | null
          pacote?: string | null
          painel_fotografia?: string | null
          qtd_coffee?: number | null
          responsavel?: string | null
          responsavel_buffet?: string | null
          restricoes_alimentares?: boolean | null
          restricoes_obs?: string | null
          sonorizacao?: string | null
          telao?: string | null
          tipo_coffee?: string | null
          tipo_evento?: string | null
          updated_at?: string
          valet?: boolean | null
        }
        Update: {
          atracao?: string | null
          bebida_alcoolica?: boolean | null
          buffet?: string | null
          cerimonial?: boolean | null
          coffee_piazza?: boolean | null
          contato?: string
          convidados_estimados?: number | null
          created_at?: string
          credenciamento?: boolean | null
          data?: string
          data_desmontagem?: string | null
          data_montagem?: string | null
          data_preenchimento?: string | null
          decoracao?: boolean | null
          desmontagem_inicio?: string | null
          desmontagem_termino?: string | null
          empresa?: string | null
          equipamentos_externos?: string | null
          estilo_decoracao?: string | null
          gerador?: string | null
          horario_inicio?: string | null
          horario_montagem?: string | null
          horario_servico?: string | null
          horario_termino?: string | null
          id?: string
          iluminacao?: string | null
          limpeza_durante?: boolean | null
          local_evento?: string | null
          microfones?: string | null
          montagem_inicio?: string | null
          montagem_termino?: string | null
          nome_evento?: string
          observacoes?: string | null
          opcao_coffee?: string | null
          pacote?: string | null
          painel_fotografia?: string | null
          qtd_coffee?: number | null
          responsavel?: string | null
          responsavel_buffet?: string | null
          restricoes_alimentares?: boolean | null
          restricoes_obs?: string | null
          sonorizacao?: string | null
          telao?: string | null
          tipo_coffee?: string | null
          tipo_evento?: string | null
          updated_at?: string
          valet?: boolean | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          created_at: string
          id: string
          position: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          position?: number
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          position?: number
          url?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved: boolean
          avatar_url: string | null
          company: string | null
          created_at: string
          id: string
          name: string
          position: number
          quote: string
          stars: number
        }
        Insert: {
          approved?: boolean
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          name: string
          position?: number
          quote: string
          stars?: number
        }
        Update: {
          approved?: boolean
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          name?: string
          position?: number
          quote?: string
          stars?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
