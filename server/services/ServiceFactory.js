import MessageService from './MessageService.js';
import PatreonService from './PatreonService.js';
import ConfigService from './ConfigService.js';
import UserService from './UserService.js';
import BanlistService from './BanlistService.js';
import AbuseService from './AbuseService.js';
import EventService from './EventService.js';
import DraftCubeService from './DraftCubeService.js';
import DisposableEmailService from './DisposableEmailService.js';
import IPQualityScoreService from './IPQualityScoreService.js';
import ProxyCheckService from './ProxyCheckService.js';
import MaintenanceService from './MaintenanceService.js';
import EmailService from './EmailService.js';
import CardService from './CardService.js';
import DeckService from './DeckService.js';

let services = {};

export default {
    messageService: (db) => {
        if (!services.messageService) {
            services.messageService = new MessageService(db);
        }

        return services.messageService;
    },
    configService: () => {
        if (!services.configService) {
            services.configService = new ConfigService();
        }

        return services.configService;
    },
    emailService: (configService) => {
        if (!services.emailService) {
            services.emailService = new EmailService(configService);
        }

        return services.emailService;
    },
    userService: (db, configService) => {
        if (!services.userService) {
            services.userService = new UserService(db, configService);
        }

        return services.userService;
    },
    patreonService: (clientId, secret, userService, callbackUrl) => {
        if (!services.patreonService) {
            services.patreonService = new PatreonService(
                clientId,
                secret,
                userService,
                callbackUrl
            );
        }

        return services.patreonService;
    },
    banlistService: (db) => {
        if (!services.banlistService) {
            services.banlistService = new BanlistService(db);
        }

        return services.banlistService;
    },
    abuseService: (db, configService) => {
        if (!services.abuseService) {
            services.abuseService = new AbuseService(db, configService);
        }

        return services.abuseService;
    },
    cardService: (db) => {
        if (!services.cardService) {
            services.cardService = new CardService(db);
        }

        return services.cardService;
    },
    deckService: (db) => {
        if (!services.deckService) {
            services.deckService = new DeckService(db);
        }

        return services.deckService;
    },
    eventService: (db) => {
        if (!services.eventService) {
            services.eventService = new EventService(db);
        }

        return services.eventService;
    },
    draftCubeService: (db) => {
        if (!services.draftCubeService) {
            services.draftCubeService = new DraftCubeService(db);
        }

        return services.draftCubeService;
    },
    disposableEmailService: (configService) => {
        if (!services.disposableEmailService) {
            services.disposableEmailService = new DisposableEmailService(configService);
        }

        return services.disposableEmailService;
    },
    ipQualityScoreService: (configService) => {
        if (!services.ipQualityScoreService) {
            services.ipQualityScoreService = new IPQualityScoreService(configService);
        }

        return services.ipQualityScoreService;
    },
    proxyCheckService: (configService) => {
        if (!services.proxyCheckService) {
            services.proxyCheckService = new ProxyCheckService(configService);
        }

        return services.proxyCheckService;
    },
    maintenanceService: (userService, abuseService, configService) => {
        if (!services.maintenanceService) {
            services.maintenanceService = new MaintenanceService(
                userService,
                abuseService,
                configService
            );
        }

        return services.maintenanceService;
    }
};
