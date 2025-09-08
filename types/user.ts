export interface Round {
  ID: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  round_number: number;
  screen_flag: boolean;
  ppt_flag: boolean;
  start_time: string;
  end_time: string;
  teams: any | null;
  reviews: any | null;
}

export interface Track {
  ID: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  title: string;
}

export interface Team {
  ID: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  code: string;
  github_installation_id: string;
  track_id: string | null;
  track: Track;
  users: any | null;
  rounds: Round[] | null;
  reviews: any | null;
}

export interface User {
  ID: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  email: string;
  profile_picture_url?: string;
  contact_number?: string;
  gender?: string;
  reg_no?: string;
  internal?: boolean;
  hosteller?: boolean;
  college_name?: string;
  role?: string;
  team_id?: string | null;
  team?: Team | null;
}

export interface GetUserResponse {
  user: User;
}
