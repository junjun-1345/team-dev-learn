// types/github.ts
export interface GitHubRepo {
  id: number;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  blog?: string;
  location?: string;
}

export interface SearchResponse {
  items: GitHubRepo[];
  total_count: number;
}
