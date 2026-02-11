describe("Lysa's Letter", function () {
    integration(function () {
        beforeEach(function () {
            const stark = this.buildDeck('stark', ['Maester Luwin', 'A Noble Cause']);
            const martell = this.buildDeck('martell', [
                "Lysa's Letter",
                'A Noble Cause',
                'Burning on the Sand'
            ]);

            this.player1.selectDeck(stark);
            this.player2.selectDeck(martell);

            this.startGame();

            this.keepStartingHands();

            this.luwin = this.player1.findCardByName('Maester Luwin', 'hand');
            this.letter = this.player2.findCardByName("Lysa's Letter", 'hand');
            this.burning = this.player2.findCardByName('Burning on the Sand', 'hand');

            this.player1.clickCard(this.luwin);

            this.completeSetup();
            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
            this.player2.clickCard(this.letter);
            this.player2.clickPrompt(this.player1.name);
            this.player2.clickPrompt('Power');
        });

        it("should set the target player's claim to 0", function () {
            expect(this.player1Object.getClaim()).toBe(0);
        });

        it('should restore the claim after an appropriate challenge', function () {
            this.unopposedChallenge(this.player1, 'Power', this.luwin);
            expect(this.player1Object.getClaim()).toBe(1);
        });

        it('should keep the claim at 0 if another set claim effect is applied before the appropriate challenge', function () {
            this.unopposedChallenge(this.player1, 'Intrigue', this.luwin);
            this.player2.clickCard(this.burning);
            this.player1.clickPrompt('Apply Claim');
            expect(this.player1Object.getClaim()).toBe(0);
        });
    });
});
