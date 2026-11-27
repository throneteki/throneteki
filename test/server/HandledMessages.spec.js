import GameServer from '../../server/gamenode/gameserver.js';

describe('handled game messages', function () {
    beforeEach(function () {
        this.setupTest({
            player1: { inPlay: ['Winterfell Steward'] },
            player2: { inPlay: ['Eddard Stark (Core)'] }
        });

        this.server = Object.assign(Object.create(GameServer.prototype), {
            games: { [this.game.id]: this.game },
            sentStates: new WeakMap(),
            handledMessages: new WeakMap(),
            pendingProblemReports: new WeakMap()
        });

        this.connect = (wrapper) => {
            const sent = [];
            wrapper.player.socket = {
                user: { username: wrapper.player.name },
                send: (message, payload) => sent.push({ message, payload })
            };
            return sent;
        };

        this.handledIn = (sent) => {
            const last = sent.at(-1);
            return last.message === 'gamestate'
                ? last.payload.handledMessages
                : last.payload.handledMessages?.[1];
        };

        this.send = (wrapper, ...args) => this.server.onGameMessage(wrapper.player.socket, ...args);

        this.sent1 = this.connect(this.player1);
        this.sent2 = this.connect(this.player2);
        this.server.sendGameState(this.game);
    });

    it('starts at none handled', function () {
        expect(this.sent1[0].payload.handledMessages).toBe(0);
        expect(this.sent2[0].payload.handledMessages).toBe(0);
    });

    it('answers each message with the count handled from that socket', function () {
        this.send(this.player1, 'chat', 'hello');
        expect(this.handledIn(this.sent1)).toBe(1);

        this.send(this.player1, 'chat', 'again');
        expect(this.handledIn(this.sent1)).toBe(2);
    });

    it('answers a message that changes nothing else', function () {
        this.send(this.player1, 'cardClicked', this.eddardStark.uuid);

        expect(this.sent1).toHaveLength(2);
        expect(this.sent1[1].message).toBe('gamestatediff');
        expect(Object.keys(this.sent1[1].payload)).toEqual(['handledMessages']);
        expect(this.handledIn(this.sent1)).toBe(1);
    });

    it('answers a message that is not a game command', function () {
        this.send(this.player1, 'notACommand');

        expect(this.handledIn(this.sent1)).toBe(1);
    });

    it('counts a message sent after leaving', function () {
        this.player1.player.left = true;
        this.send(this.player1, 'chat', 'hello');

        expect(this.server.handledMessages.get(this.player1.player.socket)).toBe(1);
    });

    it("leaves the other player's count alone", function () {
        this.send(this.player1, 'chat', 'hello');

        expect(this.sent2.at(-1).payload.handledMessages).toBeUndefined();
        expect(this.server.handledMessages.get(this.player2.player.socket)).toBeUndefined();
    });

    it('starts again from none on a new socket', function () {
        this.send(this.player1, 'chat', 'hello');
        const sent = this.connect(this.player1);
        this.server.sendGameState(this.game);

        expect(sent[0].message).toBe('gamestate');
        expect(sent[0].payload.handledMessages).toBe(0);
    });
});
