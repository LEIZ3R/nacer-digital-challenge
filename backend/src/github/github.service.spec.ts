import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubClient } from './github.client';
import { GithubUserRaw, HttpError } from './github.types';
import { UserResponseDto } from './dto/user-response.dto';

/**
 * Mock del GithubClient: el service no debería saber nada de axios.
 * Si este test se rompe por temas de HTTP, el problema está en el service.
 */
describe('GithubService', () => {
  let service: GithubService;
  let client: jest.Mocked<GithubClient>;

  const octocatRaw: GithubUserRaw = {
    login: 'octocat',
    id: 583231,
    node_id: 'MDQ6VXNlcjU4MzIzMQ==',
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    html_url: 'https://github.com/octocat',
    type: 'User',
    name: 'The Octocat',
    company: '@github',
    blog: 'https://github.blog',
    location: 'San Francisco',
    email: null,
    bio: null,
    twitter_username: null,
    public_repos: 8,
    followers: 9999,
    following: 9,
    created_at: '2011-01-25T18:44:36Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubService,
        {
          provide: GithubClient,
          useValue: { getUser: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(GithubService);
    client = module.get(GithubClient);
  });

  it('debería mapear la respuesta cruda de GitHub al DTO camelCase', async () => {
    client.getUser.mockResolvedValueOnce(octocatRaw);

    const result = await service.getUser('octocat');

    expect(client.getUser).toHaveBeenCalledWith('octocat');
    expect(result).toBeInstanceOf(UserResponseDto);
    expect(result).toEqual<UserResponseDto>({
      login: 'octocat',
      name: 'The Octocat',
      bio: null,
      avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
      profileUrl: 'https://github.com/octocat',
      company: '@github',
      location: 'San Francisco',
      email: null,
      twitter: null,
      publicRepos: 8,
      followers: 9999,
      following: 9,
      createdAt: '2011-01-25T18:44:36Z',
    });
  });

  it('debería lanzar NotFoundException cuando GitHub responde 404', async () => {
    client.getUser.mockRejectedValueOnce(
      new HttpError(404, {}, 'Not Found'),
    );

    await expect(service.getUser('ghost')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('debería lanzar ServiceUnavailableException cuando GitHub nos clava rate limit', async () => {
    client.getUser.mockRejectedValueOnce(
      new HttpError(403, { 'x-ratelimit-remaining': '0' }, 'rate limit'),
    );

    await expect(service.getUser('octocat')).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
