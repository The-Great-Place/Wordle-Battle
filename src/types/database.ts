export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      matches: {
        Row: {
          created_at: string;
          finished_at: string | null;
          id: string;
          max_guesses: number;
          room_id: string;
          started_at: string | null;
          status: 'awaiting_words' | 'active' | 'finished';
          timer_seconds: number;
          winner_player_id: string | null;
        };
        Insert: {
          created_at?: string;
          finished_at?: string | null;
          id?: string;
          max_guesses?: number;
          room_id: string;
          started_at?: string | null;
          status?: 'awaiting_words' | 'active' | 'finished';
          timer_seconds?: number;
          winner_player_id?: string | null;
        };
        Update: {
          created_at?: string;
          finished_at?: string | null;
          id?: string;
          max_guesses?: number;
          room_id?: string;
          started_at?: string | null;
          status?: 'awaiting_words' | 'active' | 'finished';
          timer_seconds?: number;
          winner_player_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'matches_room_id_fkey';
            columns: ['room_id'];
            referencedRelation: 'rooms';
            referencedColumns: ['id'];
          },
        ];
      };
      players: {
        Row: {
          auth_user_id: string | null;
          created_at: string;
          display_name: string;
          id: string;
          is_guest: boolean;
        };
        Insert: {
          auth_user_id?: string | null;
          created_at?: string;
          display_name: string;
          id?: string;
          is_guest?: boolean;
        };
        Update: {
          auth_user_id?: string | null;
          created_at?: string;
          display_name?: string;
          id?: string;
          is_guest?: boolean;
        };
        Relationships: [];
      };
      room_players: {
        Row: {
          created_at: string;
          id: string;
          joined_at: string;
          player_id: string;
          ready_state: boolean;
          room_id: string;
          seat: 'A' | 'B';
          word_locked: boolean;
        };
        Insert: {
          created_at?: string;
          id?: string;
          joined_at?: string;
          player_id: string;
          ready_state?: boolean;
          room_id: string;
          seat: 'A' | 'B';
          word_locked?: boolean;
        };
        Update: {
          created_at?: string;
          id?: string;
          joined_at?: string;
          player_id?: string;
          ready_state?: boolean;
          room_id?: string;
          seat?: 'A' | 'B';
          word_locked?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'room_players_player_id_fkey';
            columns: ['player_id'];
            referencedRelation: 'players';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'room_players_room_id_fkey';
            columns: ['room_id'];
            referencedRelation: 'rooms';
            referencedColumns: ['id'];
          },
        ];
      };
      rooms: {
        Row: {
          code: string;
          created_at: string;
          created_by_player_id: string | null;
          id: string;
          max_players: number;
          status:
            | 'waiting_for_players'
            | 'waiting_for_words'
            | 'ready_to_start'
            | 'in_match'
            | 'match_finished';
        };
        Insert: {
          code: string;
          created_at?: string;
          created_by_player_id?: string | null;
          id?: string;
          max_players?: number;
          status?:
            | 'waiting_for_players'
            | 'waiting_for_words'
            | 'ready_to_start'
            | 'in_match'
            | 'match_finished';
        };
        Update: {
          code?: string;
          created_at?: string;
          created_by_player_id?: string | null;
          id?: string;
          max_players?: number;
          status?:
            | 'waiting_for_players'
            | 'waiting_for_words'
            | 'ready_to_start'
            | 'in_match'
            | 'match_finished';
        };
        Relationships: [];
      };
      secret_words: {
        Row: {
          created_at: string;
          encrypted_word: string;
          id: string;
          match_id: string;
          player_id: string;
          word_length: number;
        };
        Insert: {
          created_at?: string;
          encrypted_word: string;
          id?: string;
          match_id: string;
          player_id: string;
          word_length?: number;
        };
        Update: {
          created_at?: string;
          encrypted_word?: string;
          id?: string;
          match_id?: string;
          player_id?: string;
          word_length?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'secret_words_match_id_fkey';
            columns: ['match_id'];
            referencedRelation: 'matches';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'secret_words_player_id_fkey';
            columns: ['player_id'];
            referencedRelation: 'players';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      match_status: 'awaiting_words' | 'active' | 'finished';
      room_seat: 'A' | 'B';
      room_status:
        | 'waiting_for_players'
        | 'waiting_for_words'
        | 'ready_to_start'
        | 'in_match'
        | 'match_finished';
    };
    CompositeTypes: Record<string, never>;
  };
};
