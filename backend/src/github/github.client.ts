import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { GithubUserRaw, HttpError } from './github.types';

/**
 * Única capa de la app que toca axios. Aísla al resto del código
 * de detalles de transporte (headers, status codes, errores de axios).
 *
 * Devuelve los datos crudos de GitHub (snake_case) o lanza HttpError
 * con status + headers + mensaje, que el service traduce a excepciones Nest.
 */
@Injectable()
export class GithubClient {
  private readonly logger = new Logger(GithubClient.name);
  private readonly apiUrl: string;
  private readonly token: string;

  constructor(
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.apiUrl = config.get<string>('GITHUB_API_URL') ?? 'https://api.github.com';
    this.token = config.get<string>('GITHUB_TOKEN') ?? '';
  }

  async getUser(username: string): Promise<GithubUserRaw> {
    const url = `${this.apiUrl}/users/${encodeURIComponent(username)}`;
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    // Sin token: 60 req/h. Con token: 5000 req/h. Vale la pena.
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await firstValueFrom(
        this.http.get<GithubUserRaw>(url, { headers }),
      );
      this.assertOk(response);
      return response.data;
    } catch (err) {
      throw this.toHttpError(err);
    }
  }

  private assertOk(response: AxiosResponse<GithubUserRaw>): void {
    if (response.status >= 200 && response.status < 300) return;
    throw new HttpError(
      response.status,
      this.normalizeHeaders(response.headers as Record<string, string | string[]>),
      `GitHub returned ${response.status}`,
    );
  }

  private toHttpError(err: unknown): HttpError {
    if (err instanceof HttpError) return err;

    if (err instanceof AxiosError) {
      const status = err.response?.status ?? 0;
      const headers = this.normalizeHeaders(
        (err.response?.headers as Record<string, string | string[]>) ?? {},
      );
      const code = err.code;
      const message = err.message;

      // Timeout de axios llega como ECONNABORTED
      if (code === 'ECONNABORTED' || code === 'ETIMEDOUT') {
        return new HttpError(408, headers, `Request timed out: ${message}`, code);
      }
      return new HttpError(status, headers, message, code);
    }

    if (err instanceof Error) {
      return new HttpError(0, {}, err.message);
    }
    return new HttpError(0, {}, 'Unknown error');
  }

  private normalizeHeaders(
    raw: Record<string, string | string[] | undefined>,
  ): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (value === undefined) continue;
      out[key.toLowerCase()] = Array.isArray(value) ? value.join(',') : String(value);
    }
    return out;
  }
}
