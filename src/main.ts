import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as hbs from 'hbs';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // helper buat bandingin value di template hbs (dipake buat nge-select
  // author yang lagi aktif di dropdown form edit book)
  hbs.registerHelper('eq', (a: unknown, b: unknown) => a === b);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // pake hbs sebagai view engine, jadi semua controller balikin HTML page
  // (res.render), bukan JSON. soalnya requirement-nya "semua response berupa page"
  app.setViewEngine('hbs');

  // session based login, bukan JWT. simpel aja soalnya cuma 1 admin hardcoded.
  // session ini yang dicek di AuthGuard buat nentuin user udah login apa belum
  app.use(
    session({
      secret: 'admin-panel-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24 }, // session hidup 1 hari
    }),
  );

  await app.listen(3000);
  console.log('App jalan di http://localhost:3000');
}
bootstrap();
