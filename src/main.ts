import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { join } from 'node:path';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/images', express.static(join(process.cwd(), 'images')));
  app.enableCors({
    origin: '*',
    exposedHeaders: ['x-access-token'],
  });
  app.use(
    graphqlUploadExpress({
      maxFileSize: 2 * 1024 * 1024,
      maxFiles: 5,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
