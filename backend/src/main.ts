import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // CORS: si CORS_ORIGIN está vacío permitimos todos (útil en dev).
  // En prod se espera que la variable esté seteada.
  const corsOrigin = config.get<string>('CORS_ORIGIN') ?? '';
  app.enableCors({
    origin: corsOrigin === '' ? true : corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
  });

  // ValidationPipe global: aplica class-validator a todos los DTOs.
  // whitelist:true descarta campos extra; forbidNonWhitelisted:true los rechaza con 400.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Filtro global:统一的 formato de error.
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = config.get<number>('PORT') ?? 3001;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Backend running on http://localhost:${port}`);
}

void bootstrap();
