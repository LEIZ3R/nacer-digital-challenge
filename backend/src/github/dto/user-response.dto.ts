/**
 * Shape de la respuesta pública de GET /user/:username.
 * camelCase por convención de la API propia, independientemente
 * de que GitHub devuelva snake_case.
 *
 * NO usamos @Expose porque el service hace el mapeo explícito —
 * más simple de leer y de testear.
 */
export class UserResponseDto {
  login!: string;
  name!: string | null;
  bio!: string | null;
  avatarUrl!: string;
  profileUrl!: string;
  company!: string | null;
  location!: string | null;
  email!: string | null;
  twitter!: string | null;
  publicRepos!: number;
  followers!: number;
  following!: number;
  createdAt!: string;
}
