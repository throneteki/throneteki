const PendingGame = require('../../server/pendinggame.js');

describe('PendingGame', function() {
    beforeEach(function() {
        this.owner = { username: 'test1' };
        this.game = new PendingGame(this.owner, { spectators: true });
    });

    describe('block list functionality', function() {
        beforeEach(function() {
            this.blockedUser = { username: 'IHarassPeople' };
            this.owner.blockList = ['iharasspeople'];
        });

        it('should not allow a blocked user to join the game', function() {
            this.game.join(2, this.blockedUser, '', () => true);
            expect(Object.values(this.game.getPlayersAndSpectators())).not.toContain(jasmine.objectContaining({ user: this.blockedUser }));
        });

        it('should not allow a blocked user to watch the game', function() {
            this.game.watch(2, this.blockedUser, '', () => true);
            expect(Object.values(this.game.getPlayersAndSpectators())).not.toContain(jasmine.objectContaining({ user: this.blockedUser }));
        });
    });
});
