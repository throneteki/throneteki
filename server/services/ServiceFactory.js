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
import GameService from './GameService.js';
import NewsService from './NewsService.js';

let services = {};

const factory = {
    messageService: () => {
        if (!services.messageService) {
            services.messageService = new MessageService();
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
    userService: (configService = factory.configService()) => {
        if (!services.userService) {
            services.userService = new UserService(configService);
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
    banlistService: () => {
        if (!services.banlistService) {
            services.banlistService = new BanlistService();
        }

        return services.banlistService;
    },
    abuseService: (configService = factory.configService()) => {
        if (!services.abuseService) {
            services.abuseService = new AbuseService(
                configService,
                factory.userService(configService)
            );
        }

        return services.abuseService;
    },
    cardService: () => {
        if (!services.cardService) {
            services.cardService = new CardService();
        }

        return services.cardService;
    },
    deckService: () => {
        if (!services.deckService) {
            services.deckService = new DeckService(factory.cardService(), factory.eventService());
        }

        return services.deckService;
    },
    eventService: () => {
        if (!services.eventService) {
            services.eventService = new EventService();
        }

        return services.eventService;
    },
    draftCubeService: () => {
        if (!services.draftCubeService) {
            services.draftCubeService = new DraftCubeService();
        }

        return services.draftCubeService;
    },
    gameService: () => {
        if (!services.gameService) {
            services.gameService = new GameService();
        }

        return services.gameService;
    },
    newsService: () => {
        if (!services.newsService) {
            services.newsService = new NewsService();
        }

        return services.newsService;
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

export default factory;
