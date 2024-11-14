describe('Ser Emmon Cuy', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('lannister', [
                'Time of Plenty',
                'Ser Emmon Cuy',
                'Hedge Knight'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.emmon = this.player1.findCardByName('Ser Emmon Cuy');
            this.hedge = this.player1.findCardByName('Hedge Knight');

            this.completeSetup();
            this.selectFirstPlayer(this.player1);
            this.player1.clickCard('Ser Emmon Cuy', 'hand');
            this.player1.clickPrompt('1');
            this.player1.clickCard('Hedge Knight', 'hand');
            this.completeMarshalPhase();
        });

        describe('when a challenge is initiated', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.emmon);
                this.player1.clickPrompt('Done');
            });

            it('should ask to trigger for Ser Emmon to trigger and raise claim and kill ser emmon', function () {
                expect(this.player1Object.activePlot.claim.modifier).toBe(0);
                expect(this.player1).toHavePrompt('Any reactions?');
                this.player1.clickCard(this.emmon);
                expect(this.player1Object.activePlot.claim.modifier).toBe(1);
                expect(this.emmon.location).toBe('dead pile');
            });

            it('should ask to trigger for Ser Emmon to trigger and raise claim and NOT kill ser emmon', function () {
                this.emmon.tokens.gold = 2;
                this.player1.clickCard(this.emmon);
                expect(this.emmon.tokens.gold).toBe(1);
                expect(this.emmon.location).toBe('play area');
            });
        });
    });
});
