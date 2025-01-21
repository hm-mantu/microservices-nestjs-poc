import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as oauth2orize from 'oauth2orize';
import { ClientI } from '../../models/interfaces/client.interface' 
import { ClientService } from '../../client/client.service';
import { v4 as v4uuid } from 'uuid';
import { CodeService } from '../../code/code.service';
import { CodeI } from '../../models/interfaces/code.interface';
import { TokenI } from '../../models/interfaces/token.interface';
import { TokenService } from '../../token/token.service';

@Injectable()
export class OathServerService {
    server = oauth2orize.createServer();
    grantCodes = null;
    accessTokens = null;

    constructor(
        private readonly clientService: ClientService,
        private readonly codeService: CodeService,
        private readonly tokenService: TokenService,
        ) {            
        // Register serialialization function
        this.server.serializeClient((client: ClientI, done) => done(null, client.id),);
        
        // Register deserialization function
        this.server.deserializeClient(async (id, done) => {
            const client = await this.clientService.findByClientid(id)
            if (client) {
                done(null, client);
            }
            done(new UnauthorizedException(`Invalid Client ID`));
        });

        // Grant authorization codes. The callback takes the `client` requesting
        // authorization, the `redirectUri` (which is used as a verifier in the
        // subsequent exchange), the authenticated `user` granting access, and
        // their response, which contains approved scope, duration, etc. as parsed by
        // the application. The application issues a code, which is bound to these
        // values, and will be exchanged for an access token.   
        this.server.grant(
            oauth2orize.grant.code(async (client, redirectUri, user, ares, done) => {
                const code: CodeI = {
                    value: v4uuid(),
                    clientId: client._id,
                    redirectUri: redirectUri,
                    userId: user._id
                }
                await this.codeService.create(code);
                return done(null, code.value);
            }),
        );

        // Exchange authorization codes for access tokens. The callback accepts the
        // `client`, which is exchanging `code` and any `redirectUri` from the
        // authorization request for verification. If these values are validated, the
        // application issues an access token on behalf of the user who authorized the
        // code.
        this.server.exchange(
            oauth2orize.exchange.code(async (client, code, redirectUri, done) => {
                try {
                    const authCode = await this.codeService.getByCode(code);
                    if (!authCode) {
                        return done(new UnauthorizedException('Invalid Grand Code'));
                    }
                    if (client._id.toString() !== authCode.clientId){
                        return done(null, false);
                    }
                    if (redirectUri !== authCode.redirectUri) {
                        return done(null, false);
                    }

                    // Delete auth code now that it has been used
                    await this.codeService.removeCode(code)
                    // Create a new access token
                    const token: TokenI =  {
                        value: v4uuid(),
                        clientId: authCode.clientId,
                        userId: authCode.userId
                    };

                    await this.tokenService.create(token)
                    return done(null, token.value);
                } catch (error) {
                    return done(null, false);
                }
              
            }),
        );
    }
}
