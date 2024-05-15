import { init as AccountInit } from './account.js';
import { init as EventsInit } from './events.js';
import { init as DecksInit } from './decks.js';
import { init as DraftCubesInit } from './draftCubes.js';
import { init as CardsInit } from './cards.js';
import { init as NewsInit } from './news.js';
import { init as UserInit } from './user.js';
import { init as MessagesInit } from './messages.js';
import { init as BanlistInit } from './banlist.js';

export const init = function (server, options) {
    AccountInit(server, options);
    DecksInit(server, options);
    DraftCubesInit(server, options);
    CardsInit(server, options);
    NewsInit(server, options);
    UserInit(server, options);
    MessagesInit(server, options);
    BanlistInit(server, options);
    EventsInit(server, options);
};
