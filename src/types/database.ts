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
      guesses: {
        Row: {
          created_at: string;
          guess_index: number;
          guess_word: string;
          id: string;
          match_id: string;
          player_id: string;
          result_pattern: string;
        };
        Insert: {
          created_at?: string;
          guess_index: number;
          guess_word: string;
          id?: string;
          match_id: string;
          player_id: string;
          result_pattern: string;
        };
        Update: {
          created_at?: string;
          guess_index?: number;
          guess_word?: string;
          id?: string;
          match_id?: string;
          player_id?: string;
          result_pattern?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'guesses_match_id_fkey';
            columns: ['match_id'];
            referencedRelation: 'matches';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'guesses_player_id_fkey';
            columns: ['player_id'];
            referencedRelation: 'players';
            referencedColumns: ['id'];
          },
        ];
      };
      match_players: {
        Row: {
          created_at: string;
          id: string;
          last_guess_at: string | null;
          match_id: string;
          player_id: string;
          solved_at: string | null;
          timed_out_at: string | null;
          turn_deadline_at: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          last_guess_at?: string | null;
          match_id: string;
          player_id: string;
          solved_at?: string | null;
          timed_out_at?: string | null;
          turn_deadline_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          last_guess_at?: string | null;
          match_id?: string;
          player_id?: string;
          solved_at?: string | null;
          timed_out_at?: string | null;
          turn_deadline_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'match_players_match_id_fkey';
            columns: ['match_id'];
            referencedRelation: 'matches';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'match_players_player_id_fkey';
            columns: ['player_id'];
            referencedRelation: 'players';
            referencedColumns: ['id'];
          },
        ];
      };
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
      valid_words: {
        Row: {
          word: string;
        };
        Insert: {
          word: string;
        };
        Update: {
          word?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_valid_dictionary_word: {
        Args: {
          p_word: string;
        };
        Returns: boolean;
      };
      restart_room_match: {
        Args: {
          p_player_id: string;
          p_room_id: string;
        };
        Returns: {
          match_id: string;
          match_status: 'awaiting_words' | 'active' | 'finished';
          room_id: string;
          room_status:
            | 'waiting_for_players'
            | 'waiting_for_words'
            | 'ready_to_start'
            | 'in_match'
            | 'match_finished';
        }[];
      };
      submit_secret_word: {
        Args: {
          p_match_id: string;
          p_player_id: string;
          p_secret_word: string;
        };
        Returns: {
          match_id: string;
          match_status: 'awaiting_words' | 'active' | 'finished';
          room_id: string;
          room_status:
            | 'waiting_for_players'
            | 'waiting_for_words'
            | 'ready_to_start'
            | 'in_match'
            | 'match_finished';
          word_locked: boolean;
        }[];
      };
      submit_match_guess: {
        Args: {
          p_guess_word: string;
          p_match_id: string;
          p_player_id: string;
        };
        Returns: {
          created_at: string;
          finished_at: string | null;
          guess_id: string;
          guess_index: number;
          match_status: 'awaiting_words' | 'active' | 'finished';
          result_pattern: string;
          winner_player_id: string | null;
        }[];
      };
      sync_match_timeouts: {
        Args: {
          p_match_id: string;
        };
        Returns: {
          finished_at: string | null;
          match_status: 'awaiting_words' | 'active' | 'finished';
          timed_out_player_id: string | null;
          winner_player_id: string | null;
        }[];
      };
    };
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
