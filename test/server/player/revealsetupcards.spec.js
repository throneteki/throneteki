import Player from '../../../server/game/player.js';

describe('Player', function () {
    describe('revealSetupCards', function () {
        beforeEach(function () {
            this.game = { raiseEvent: vi.fn() };
            this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.game);
            this.player.deck = {};
            this.player.initialise();

            this.cardSpy = { isUnique: vi.fn(), addDuplicate: vi.fn() };
            this.duplicateSpy = { isUnique: vi.fn(), addDuplicate: vi.fn() };

            this.cardSpy.facedown = true;
            this.cardSpy.name = 'Card';
            this.duplicateSpy.facedown = true;
            this.duplicateSpy.name = 'Dupe';

            this.player.cardsInPlay.push(this.cardSpy);
            this.player.cardsInPlay.push(this.duplicateSpy);
        });

        describe('when cards are not unique', function () {
            beforeEach(function () {
                this.player.revealSetupCards();
            });

            it('should not attempt to add duplicates', function () {
                expect(this.cardSpy.addDuplicate).not.toHaveBeenCalled();
            });

            it('should mark the card as face up', function () {
                expect(this.cardSpy.facedown).toBe(false);
            });
        });

        describe('when there is a unique card', function () {
            beforeEach(function () {
                this.cardSpy.isUnique.mockReturnValue(true);
                this.duplicateSpy.isUnique.mockReturnValue(true);
            });

            describe('and a duplicate is found', function () {
                beforeEach(function () {
                    this.duplicateSpy.name = this.cardSpy.name;

                    this.player.revealSetupCards();
                });

                it('should mark the card as face up', function () {
                    expect(this.duplicateSpy.facedown).toBe(false);
                });

                it('should add a duplicate', function () {
                    expect(this.cardSpy.addDuplicate).toHaveBeenCalled();
                });

                it('should remove the duplicate from the cards in play', function () {
                    expect(this.player.cardsInPlay).not.toContain(this.duplicateSpy);
                });
            });

            describe('and no duplicate is found', function () {
                beforeEach(function () {
                    this.player.revealSetupCards();
                });

                it('should not add any duplicates', function () {
                    expect(this.cardSpy.addDuplicate).not.toHaveBeenCalled();
                });

                it('should not remove any cards from in play', function () {
                    expect(this.player.cardsInPlay.length).toBe(2);
                });
            });
        });

        it('should turn all cards faceup', function () {
            this.player.revealSetupCards();

            expect(this.player.cardsInPlay).not.toContainEqual(
                expect.objectContaining({
                    facedown: true
                })
            );
        });
    });
});
