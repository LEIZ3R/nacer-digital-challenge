import { Injectable, Logger } from '@nestjs/common';
import {
  BadGatewayException,
  NotFoundException,
  RequestTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GithubClient } from './github.client';
import { GithubUserRaw, HttpError } from './github.types';
import { UserResponseDto } from './dto/user-response.dto';

/**
 * Capa de orquestación: llama al client, mapea la respuesta cruda de GitHub
 * (snake_case) al DTO de la API (camelCase), y traduce errores HTTP
 * a excepciones de Nest con códigos semánticos.
 */
@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(private readonly client: GithubClient) {}

  async getUser(username: string): Promise<UserResponseDto> {
    let raw: GithubUserRaw;
    try {
      raw = await this.client.getUser(username);
    } catch (err) {
      throw this.mapError(err);
    }
    return this.toDto(raw);
  }

  private mapError(err: unknown): Error {
    if (err instanceof HttpError) {
      // Rate limit: GitHub 403 con X-RateLimit-Remaining: 0
      if (err.status === 403 && err.headers['x-ratelimit-remaining'] === '0') {
        return new ServiceUnavailableException(
          'GitHub API rate limit exceeded. Try again later or set GITHUB_TOKEN.',
        );
      }
      if (err.status === 404) {
        return new NotFoundException(`GitHub user not found: ${err.message}`);
      }
      if (err.status === 408 || err.code === 'ECONNABORTED') {
        return new RequestTimeoutException('GitHub API request timed out');
      }
      return new BadGatewayException(`GitHub API error: ${err.message}`);
    }

    // Error no HTTP (p.ej. DNS fail, conexión rechazada, etc.)
    if (err instanceof Error) {
      this.logger.error(`Unexpected error contacting GitHub: ${err.message}`);
      return new BadGatewayException(`Could not reach GitHub API: ${err.message}`);
    }
    return new BadGatewayException('Unknown error contacting GitHub API');
  }

  /**
   * snake_case (GitHub) → camelCase (nuestra API).
   * Sólo exponemos los campos del contrato — el resto se descarta.
   */
  private toDto(raw: GithubUserRaw): UserResponseDto {
    const dto = plainToInstance(
      UserResponseDto,
      {
        login: raw.login,
        name: raw.name ?? null,
        bio: raw.bio ?? null,
        avatarUrl: raw.avatar_url,
        profileUrl: raw.html_url,
        company: raw.company ?? null,
        location: raw.location ?? null,
        email: raw.email ?? null,
        twitter: raw.twitter_username ?? null,
        publicRepos: raw.public_repos,
        followers: raw.followers,
        following: raw.following,
        createdAt: raw.created_at,
      },
      { excludeExtraneousValues: false },
    );
    return dto;
  }
}
