// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-02-01: Updated to use new test helpers (setupCards)

describe('Snow Storm', function () {
    integration(function () {
        beforeEach(function () {
            // Note: Ice can only attach to Stark characters, so use Bran
            const deck1 = this.buildDeck('stark', [
                'Snow Storm',
                'The Roseroad',
                'Bran Stark (Core)',
                'Ice (Core)'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'A Noble Cause',
                'The Kingsroad',
                'Lannisport (Core)',
                'Hedge Knight',
                "Widow's Wail"
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.roseroad = this.player1.findCardByName('The Roseroad', 'hand');
            this.bran = this.player1.findCardByName('Bran Stark', 'hand');
            this.ice = this.player1.findCardByName('Ice', 'hand');

            this.kingsroad = this.player2.findCardByName('The Kingsroad', 'hand');
            this.lannisport = this.player2.findCardByName('Lannisport', 'hand');
            this.knight = this.player2.findCardByName('Hedge Knight', 'hand');
            this.widowsWail = this.player2.findCardByName("Widow's Wail", 'hand');

            this.player1.setupCards([this.roseroad, this.bran, this.ice]);
            this.player2.setupCards([
                this.kingsroad,
                this.lannisport,
                this.knight,
                this.widowsWail
            ]);

            this.completeSetup();

            // Attach Ice to Bran and Widow's Wail to knight
            this.player1.clickCard(this.ice);
            this.player1.clickCard(this.bran);
            this.player2.clickCard(this.widowsWail);
            this.player2.clickCard(this.knight);

            this.selectFirstPlayer(this.player1);
        });

        describe('when Snow Storm is revealed', function () {
            it('should kneel all locations', function () {
                expect(this.roseroad.kneeled).toBe(true);
                expect(this.kingsroad.kneeled).toBe(true);
                expect(this.lannisport.kneeled).toBe(true);
            });

            it('should kneel all attachments', function () {
                expect(this.ice.kneeled).toBe(true);
                expect(this.widowsWail.kneeled).toBe(true);
            });

            it('should not kneel characters', function () {
                expect(this.bran.kneeled).toBe(false);
                expect(this.knight.kneeled).toBe(false);
            });
        });
    });
});
