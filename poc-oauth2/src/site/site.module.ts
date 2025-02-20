import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SiteController } from './site.controller';
import * as passport from 'passport';
import { ensureLoggedIn } from 'connect-ensure-login';

@Module({
  controllers: [SiteController]
})
export class SiteModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        passport.authenticate('local', {
          successReturnToOrRedirect: '/',
          failureRedirect: '/login?error',
        }),
      )
      .forRoutes({ path: 'login', method: RequestMethod.POST });

    consumer
      .apply(ensureLoggedIn())
      .forRoutes({ path: 'account', method: RequestMethod.GET });

    return;
  }
}
