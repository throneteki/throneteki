const MessageService = require('./MessageService');
const PatreonService = require('./PatreonService');
const ConfigService = require('./ConfigService');
const UserService = require('./UserService');
const BanlistService = require('./BanlistService');
const EventService = require('./EventService');
const DraftCubeService = require('./DraftCubeService');

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
    },
    banlistService: (db) => {
        if(!services.banlistService) {
            services.banlistService = new BanlistService(db);
        }

        return services.banlistService;
    },
    eventService: (db) => {
        if(!services.eventService) {
            services.eventService = new EventService(db);
        }

        return services.eventService;
    },
    draftCubeService: (db) => {
        if(!services.draftCubeService) {
            services.draftCubeService = new DraftCubeService(db);
        }

        return services.draftCubeService;
    }
};
