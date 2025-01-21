import { Controller, Get, Render, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('site')
export class SiteController {
    @Get()
    @Render('index')
    index(@Req() req: Request, @Res() res: Response) {
        // return res.render('index', { layout: 'name of layout', message: 'Hello World' });
        return { isLoggedIn: req?.user };
        // return res.render(
        //     'index',
        //     { message: 'Hello world!' },
        //     function (err, html) {
        //         console.log(err);
                
        //         // Here you have access to the generated HTML
        //         res.send(html)
        //     }
        // );
    }

    @Get('/login')
    @Render('login-form')
    loginForm(@Query() query): object {
        // console.log("Login route");
        // console.log(query);
        
        const { error } = query;
        return {
            error: error !== undefined,
        };
    }

    @Get('/logout')
    logout(@Req() req: Request, @Res() res: Response) {
    //   req?.logout();
      res.redirect('/site');
    }
}
