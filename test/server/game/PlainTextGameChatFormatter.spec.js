import PlainTextGameChatFormatter from '../../../server/game/PlainTextGameChatFormatter.js';
import GameChat from '../../../server/game/gamechat.js';
import BaseCard from '../../../server/game/basecard.js';
import Spectator from '../../../server/game/spectator.js';

describe('PlainTextGameChatFormatter', function () {
    beforeEach(function () {
        this.chat = new GameChat();
        this.formatter = new PlainTextGameChatFormatter(this.chat);
    });

    describe('format()', function () {
        it('works for plain text messages', function () {
            this.chat.addMessage('Hello world');
            expect(this.formatter.format()).toMatch(/Hello world$/);
        });

        it('works for chat messages', function () {
            this.chat.addChatMessage('{0} {1}', { name: 'Player 1' }, 'good game!');
            expect(this.formatter.format()).toMatch(/Player 1: good game!$/);
        });

        it('works for status alerts', function () {
            this.chat.addAlert('danger', 'Will Robinson');
            expect(this.formatter.format()).toMatch(/DANGER Will Robinson$/);
        });

        it('works for heading alerts', function () {
            this.chat.addAlert('endofround', 'End of round 1');
            expect(this.formatter.format()).toMatch(
                /==================== End of round 1 ====================$/
            );
        });

        it('works for embedded cards', function () {
            let card = new BaseCard({}, { name: 'The Pounce That Was Promised' });
            this.chat.addMessage('Player 1 plays {0} from their hand', card);
            expect(this.formatter.format()).toMatch(
                /Player 1 plays The Pounce That Was Promised from their hand$/
            );
        });

        it('works for embedded players', function () {
            let player = new Spectator(1, { username: 'Player 1' });
            this.chat.addMessage('{0} plays The Pounce That Was Promised from their hand', player);
            expect(this.formatter.format()).toMatch(
                /Player 1 plays The Pounce That Was Promised from their hand$/
            );
        });

        it('works for embedded arrays', function () {
            this.chat.addMessage('The character {0}', ['kneels', 'cries', 'dies']);
            expect(this.formatter.format()).toMatch(/The character kneels, cries, and dies$/);
        });
    });
});
