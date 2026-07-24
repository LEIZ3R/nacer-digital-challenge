/**
 * Shape crudo de la respuesta de GitHub para GET /users/:username.
 * Sólo los campos que nos interesan — no tipamos el resto.
 */
export interface GithubUserRaw {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  html_url: string;
  type: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

/**
 * Error de transporte normalizado. El client lo lanza; el service
 * lo traduce a excepciones Nest (NotFound, ServiceUnavailable, etc.).
 */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly headers: Record<string, string>,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
