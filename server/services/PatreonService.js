import patreon from 'patreon';
const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;
import pledge_schema from 'patreon/dist/schemas/pledge.js';
import logger from '../log.js';

class PatreonService {
    constructor(clientId, secret, userService, callbackUrl) {
        this.userService = userService;
        this.callbackUrl = callbackUrl;

        this.patreonOAuthClient = patreonOAuth(clientId, secret);
    }

    async getPatreonStatusForUser(user) {
        let response;
        let patreonApiClient = patreonAPI(user.patreon.access_token);

        try {
            response = await patreonApiClient('/current_user', {
                fields: {
                    pledge: [...pledge_schema.default_attributes, pledge_schema.attributes.declined_since, pledge_schema.attributes.created_at]
                }
            });
        } catch(err) {
            logger.error(err);

            return 'none';
        }

        let { id } = response.rawJson.data;
        let pUser = response.store.find('user', id);

        if(!pUser || !pUser.pledges || pUser.pledges.length === 0) {
            return 'linked';
        } 
        
        return 'pledged';
    }

    async refreshTokenForUser(user) {
        let response;
        try {
            response = await this.patreonOAuthClient.refreshToken(user.patreon.refresh_token);
        } catch(err) {
            logger.error('Error refreshing patreon account %s', err);
            return undefined;
        }
        
        let userDetails = user.getDetails();
        // eslint-disable-next-line require-atomic-updates
        user.patreon = userDetails.patreon = response;

        try {
            await this.userService.update(userDetails);
        } catch(err) {
            logger.error(err);
            return undefined;
        }

        return response;
    }

    async linkAccount(username, code) {
        let response;
        try {
            response = await this.patreonOAuthClient.getTokens(code, this.callbackUrl);
        } catch(err) {
            logger.error('Error linking patreon account %s', err);
            return false;
        }

        response.date = new Date();
        
        let dbUser = await this.userService.getUserByUsername(username);
        if(!dbUser) {
            logger.error('Error linking patreon account, user not found');
            return false;
        }

        let user = dbUser.getDetails();
        user.patreon = response;

        try {
            await this.userService.update(user);
        } catch(err) {
            logger.error(err);
            return false;
        }

        return true;
    }

    async unlinkAccount(username) {
        let dbUser = await this.userService.getUserByUsername(username);
        if(!dbUser) {
            logger.error('Error unlinking patreon account, user not found');
            return false;
        }

        let user = dbUser.getDetails();
        user.patreon = undefined;

        try {
            await this.userService.update(user);
        } catch(err) {
            logger.error(err);
            return false;
        }

        return true;
    }
}

export default PatreonService;
