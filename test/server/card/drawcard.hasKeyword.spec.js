import DrawCard from '../../../server/game/drawcard.js';

describe('the DrawCard', function () {
    describe('the hasKeyword() function', function () {
        beforeEach(function () {
            this.owner = { noTimer: true };
            this.card = new DrawCard(this.owner, {});
        });

        it('should return false if no keyword has been added', function () {
            expect(this.card.hasKeyword('stealth')).toBe(false);
        });

        it('should return true if a keyword has been added', function () {
            this.card.addKeyword('stealth');
            expect(this.card.hasKeyword('stealth')).toBe(true);
        });

        it('should not be case sensitive', function () {
            this.card.addKeyword('Intimidate');
            expect(this.card.hasKeyword('InTiMiDaTe')).toBe(true);
        });

        it('should return true if a keyword has been added more than it has been removed', function () {
            this.card.addKeyword('stealth');
            this.card.addKeyword('stealth');
            this.card.removeKeyword('stealth');
            expect(this.card.hasKeyword('stealth')).toBe(true);
        });

        it('should return false if a keyword has been removed more than it has been added', function () {
            this.card.removeKeyword('stealth');
            this.card.removeKeyword('stealth');
            this.card.addKeyword('stealth');
            expect(this.card.hasKeyword('stealth')).toBe(false);
        });
    });
});
