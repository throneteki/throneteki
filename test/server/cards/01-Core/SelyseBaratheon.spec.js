describe('Selyse Baratheon (Core)', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('baratheon', ['Sneak Attack', 'Selyse Baratheon (Core)']);
            const deck2 = this.buildDeck('martell', ['Sneak Attack', 'Nymeria Sand (TRtW)']);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Selyse Baratheon', 'hand');
            this.player2.clickCard('Nymeria Sand', 'hand');
            this.completeSetup();
            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();

            this.selyse = this.player1.findCardByName('Selyse Baratheon', 'play area');
            this.player2.clickMenu('Nymeria Sand', 'Remove and gain icon');
            this.player2.clickCard(this.selyse);
            this.player2.clickPrompt('Intrigue');

            expect(this.selyse.hasIcon('intrigue')).toBe(false);

            this.player1.clickMenu(
                this.selyse,
                'Pay 1 gold to give an intrigue icon to a character'
            );
            this.player1.clickCard(this.selyse);
        });

        it('should allow a stolen icon to be restored', function () {
            expect(this.selyse.hasIcon('intrigue')).toBe(true);
        });

        it('should cost 1 gold', function () {
            expect(this.player1Object.gold).toBe(4);
        });
    });
});
