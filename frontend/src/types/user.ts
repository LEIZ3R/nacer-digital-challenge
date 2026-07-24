// Tipo compartido: match exacto con UserResponseDto del backend.
// Mantener este contrato sincronizado es la ÚNICA dependencia tipada
// del frontend respecto al backend. Si el backend agrega o cambia un
// campo, hay que tocar este archivo.
export type User = {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  profileUrl: string;
  company: string | null;
  location: string | null;
  email: string | null;
  twitter: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
};
