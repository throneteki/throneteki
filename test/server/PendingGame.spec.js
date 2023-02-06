const PendingGame = require('../../server/pendinggame');
const User = require('../../server/models/User');

describe('PendingGame', function() {
    beforeEach(function() {
        this.owner = new User({ username: 'test1' });
        this.game = new PendingGame(this.owner, 'development', { spectators: true });
    });

    describe('block list functionality', function() {
        beforeEach(function() {
            this.blockedUser = new User({ username: 'IHarassPeople' });
            this.owner.block(this.blockedUser);
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

    describe('isVisibleFor', function() {
        beforeEach(function() {
            this.otherUser = new User({ username: 'foo' });
        });

        it('should return true by default', function() {
            expect(this.game.isVisibleFor(this.otherUser)).toBe(true);
        });

        describe('when the owner blocks the other user', function() {
            beforeEach(function() {
                this.owner.block(this.otherUser);
            });

            it('should return false', function() {
                expect(this.game.isVisibleFor(this.otherUser)).toBe(false);
            });
        });

        describe('when the other user blocks the owner', function() {
            beforeEach(function() {
                this.otherUser.block(this.owner);
            });

            it('should return false', function() {
                expect(this.game.isVisibleFor(this.otherUser)).toBe(false);
            });
        });

        describe('when a joined player blocks the other user', function() {
            beforeEach(function() {
                let playerUser = new User({ username: 'player' });
                playerUser.block(this.otherUser);
                this.game.addPlayer(1, playerUser);
            });

            it('should return false', function() {
                expect(this.game.isVisibleFor(this.otherUser)).toBe(false);
            });
        });
    });
});
