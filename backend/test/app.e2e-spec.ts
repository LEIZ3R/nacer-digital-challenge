import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import nock from 'nock';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';

/**
 * E2E: levanta la app entera y le pega con supertest.
 * nock intercepta las llamadas a api.github.com para que el test
 * sea determinista y no dependa de la red.
 */
describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.PORT = '0';
    process.env.GITHUB_API_URL = 'https://api.github.com';
    process.env.NODE_ENV = 'test';
    // sin GITHUB_TOKEN a propósito, para ejercitar la rama "no token"

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // replicamos lo que hace main.ts: validación + filter
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('GET /health', () => {
    it('debería responder 200 con status ok', async () => {
      const res = await request(app.getHttpServer()).get('/health').expect(200);
      expect(res.body).toMatchObject({ status: 'ok' });
      expect(typeof res.body.uptime).toBe('number');
      expect(typeof res.body.timestamp).toBe('string');
    });
  });

  describe('GET /user/:username', () => {
    it('debería devolver 200 con el perfil mapeado', async () => {
      nock('https://api.github.com')
        .get('/users/octocat')
        .reply(200, {
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
        });

      const res = await request(app.getHttpServer())
        .get('/user/octocat')
        .expect(200);

      expect(res.body).toEqual({
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

    it('debería devolver 400 cuando el username no cumple la regex', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/!!!invalid!!!')
        .expect(400);

      expect(res.body).toMatchObject({
        statusCode: 400,
        method: 'GET',
        path: '/user/!!!invalid!!!',
      });
      expect(res.body.message).toBeDefined();
    });
  });
});
