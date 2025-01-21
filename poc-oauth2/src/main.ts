import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as hbs from 'hbs';
import * as passport from 'passport';
import * as session from 'express-session';
import { ConfigService } from './configs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const cfgService = new ConfigService();
  const cfg = cfgService.get('serverConfig');  
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  // console.log(join(__dirname, 'views/index.hbs'));
  // 
  app.useStaticAssets(join(__dirname, 'public'));
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');

  hbs.registerPartials(__dirname + '/views/partials');

  // app.use(
  //   session({
  //     secret: 'session-secret',
  //   }),
  // );

  // app.use(passport.initialize());
  // app.use(passport.session());

  // passport.serializeUser((user, done) => {    
  //   done(null, user);
  // });

  // passport.deserializeUser((user, done) => {
  //   done(null, user);
  // });

  await app.listen(cfg.port);
  console.log(`Server started on http://localhost:${cfg.port}`);
}
bootstrap();
