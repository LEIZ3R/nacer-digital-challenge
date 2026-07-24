import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

/**
 * Valida el path param :username contra las reglas oficiales de GitHub:
 *   - 1-39 caracteres
 *   - alfanumérico + guiones
 *   - no empieza ni termina con guión
 *   - no tiene dos guiones seguidos
 */
export class UsernameParamDto {
  @IsString()
  @MinLength(1)
  @MaxLength(39)
  @Matches(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, {
    message: 'username must be a valid GitHub username',
  })
  username!: string;
}
