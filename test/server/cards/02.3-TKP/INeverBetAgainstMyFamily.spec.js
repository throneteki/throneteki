describe('I Never Bet Against My Family', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                hand: ['I Never Bet Against My Family'],
                drawDeckBottom: [
                    'Hedge Knight',
                    'Winterfell Steward',
                    'Cersei Lannister (Core)',
                    'Lannisport Merchant',
                    'Tyrion Lannister (Core)'
                ],
                gold: 1
            }
        });
        this.bottomFive = this.player1Object.drawDeck.slice(-5);
        this.unique = this.cerseiLannister;
        this.player1.clickCard(this.iNeverBetAgainstMyFamily);
    });

    it('kneels your faction card to reveal the bottom 5 cards of your deck', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1).toBeAbleToSelect(this.bottomFive.find((card) => card.isUnique()));
        expect(this.player1).not.toBeAbleToSelect(this.lannisportMerchant);
    });

    it('puts a revealed unique Lannister character into play and the others on the bottom in any order', function () {
        const unique = this.bottomFive.find((card) => card.isUnique());
        this.player1.clickCard(unique);
        this.player1.clickPrompt('Done');
        const others = this.bottomFive.filter((card) => card !== unique);
        for (const card of others) {
            this.player1.clickCard(card);
        }
        expect(unique.location).toBe('play area');
        expect(this.player1Object.drawDeck.slice(-4)).toEqual(expect.arrayContaining(others));
        expect(this.player1).isReadyToTakeAction();
    });

    it('discards that character at the end of the phase', function () {
        const unique = this.bottomFive.find((card) => card.isUnique());
        this.player1.clickCard(unique);
        this.player1.clickPrompt('Done');
        for (const card of this.bottomFive.filter((card) => card !== unique)) {
            this.player1.clickCard(card);
        }
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        expect(unique.location).toBe('discard pile');
    });
});
