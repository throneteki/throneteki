import patreon from 'patreon';
const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;
import pledgeSchema from 'patreon/dist/schemas/pledge.js';
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
                    pledge: [
                        ...pledgeSchema.default.default_attributes,
                        pledgeSchema.default.attributes.declined_since,
                        pledgeSchema.default.attributes.created_at
                    ]
                }
            });
        } catch (err) {
            logger.error(
                'Error getting patreon status for %s: %s',
                user.username,
                await this.errorStreamToString(err)
            );

            return 'none';
        }

        let { id } = response.rawJson.data;
        let pUser = response.store.find('user', id);

        if (!pUser || !pUser.pledges || pUser.pledges.length === 0) {
            return 'linked';
        }

        return 'pledged';
    }

    async refreshTokenForUser(user) {
        let response;
        try {
            response = await this.patreonOAuthClient.refreshToken(user.patreon.refresh_token);
        } catch (err) {
            logger.error(
                'Error refreshing patreon account %s',
                await this.errorStreamToString(err)
            );

            return undefined;
        }

        let userDetails = user.getDetails();
        // eslint-disable-next-line require-atomic-updates
        user.patreon = userDetails.patreon = response;

        try {
            await this.userService.update(userDetails);
        } catch (err) {
            logger.error(err);
            return undefined;
        }

        return response;
    }

    errorStreamToString(err) {
        const stream = err.response ? err.response.body : err.body;

        return new Promise((resolve, reject) => {
            let str = '';

            stream.on('data', (chunk) => {
                str += chunk;
            });

            stream.on('end', () => {
                resolve(str);
            });

            stream.on('error', () => {
                reject();
            });
        });
    }

    async linkAccount(username, code) {
        let response;
        try {
            response = await this.patreonOAuthClient.getTokens(code, this.callbackUrl);
        } catch (err) {
            logger.error('Error linking patreon account %s', await this.errorStreamToString(err));
            return false;
        }

        response.date = new Date();

        let user = await this.userService.getUserByUsername(username);
        if (!user) {
            logger.error('Error linking patreon account, user not found');
            return false;
        }

        user.patreon = response;

        try {
            await this.userService.update(user);
        } catch (err) {
            logger.error(err);
            return false;
        }

        return user;
    }

    async unlinkAccount(username) {
        let dbUser = await this.userService.getUserByUsername(username);
        if (!dbUser) {
            logger.error('Error unlinking patreon account, user not found');
            return false;
        }

        let user = dbUser.getDetails();
        user.patreon = undefined;

        try {
            await this.userService.update(user);
        } catch (err) {
            logger.error(err);
            return false;
        }

        return true;
    }
}

export default PatreonService;
