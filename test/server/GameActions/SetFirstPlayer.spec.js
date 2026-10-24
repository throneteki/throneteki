import SetFirstPlayer from '../../../server/game/GameActions/SetFirstPlayer.js';

describe('SetFirstPlayer', function () {
    beforeEach(function () {
        this.player1 = { firstPlayer: true };
        this.player2 = { firstPlayer: false };
        const game = { getAllPlayers: () => [this.player1, this.player2] };
        this.player1.game = game;
        this.player2.game = game;
    });

    describe('allow()', function () {
        it('returns true for a player who is not first player', function () {
            expect(SetFirstPlayer.allow({ player: this.player2 })).toBe(true);
        });

        it('returns false for the first player', function () {
            expect(SetFirstPlayer.allow({ player: this.player1 })).toBe(false);
        });
    });

    describe('createEvent()', function () {
        beforeEach(function () {
            this.event = SetFirstPlayer.createEvent({ player: this.player2 });
        });

        it('creates an onFirstPlayerDetermined event', function () {
            expect(this.event.name).toBe('onFirstPlayerDetermined');
            expect(this.event.player).toBe(this.player2);
        });

        it('makes only that player first player when the handler runs', function () {
            this.event.executeHandler();

            expect(this.player1.firstPlayer).toBe(false);
            expect(this.player2.firstPlayer).toBe(true);
        });
    });
});
