import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { GithubClient } from './github.client';

@Module({
  imports: [
    // Timeout 5s para que requests colgados no bloqueen la app.
    // maxRedirects evita seguir chains de redirects de GitHub por error.
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [GithubController],
  providers: [GithubService, GithubClient],
  exports: [GithubService],
})
export class GithubModule {}
