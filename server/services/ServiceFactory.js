const MessageService = require('./MessageService');
const PatreonService = require('./PatreonService');
const ConfigService = require('./ConfigService');
const UserService = require('./UserService');

let services = {};

module.exports = {
    messageService: db => {
        if(!services.messageService) {
            services.messageService = new MessageService(db);
        }

        return services.messageService;
    },
    configService: () => {
        if(!services.configService) {
            services.configService = new ConfigService();
        }

        return services.configService;
    },
    userService: (db, configService) => {
        if(!services.userService) {
            services.userService = new UserService(db, configService);
        }

        return services.userService;
    },
    patreonService: (clientId, secret, userService, callbackUrl) => {
        if(!services.patreonService) {
            services.patreonService = new PatreonService(clientId, secret, userService, callbackUrl);
        }

        return services.patreonService;
    }
};
