import { Controller, Get, Res, Req, Render, Post } from '@nestjs/common';

@Controller('oauth')
export class OauthController {
    @Get('/authorize')
    @Render('dialog')
    authorization(@Req() req, @Res() res) {            
        return {
            transactionId: req.oauth2.transactionID,
            user: req.user,
            client: req.oauth2.client,
        };
    }

    @Post('/authorize/decision')
    decision() {
      return;
    }
  
    @Post('/token')
    token() {
      return;
    }
}
