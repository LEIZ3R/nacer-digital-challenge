import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';
import { UsernameParamDto } from './dto/username-param.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller()
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  /**
   * Liveness check. No toca red, no toca auth.
   * Útil para health checks de Render / Kubernetes / etc.
   */
  @Get('health')
  health(): { status: string; uptime: number; timestamp: string } {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Devuelve el perfil público de un usuario de GitHub.
   * El ValidationPipe global aplica la regex de username antes de llegar acá.
   */
  @Get('user/:username')
  async getUser(@Param() params: UsernameParamDto): Promise<UserResponseDto> {
    return this.githubService.getUser(params.username);
  }
}
