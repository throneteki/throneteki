describe('Dywen', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('thenightswatch', [
                'Loan from the Iron Bank',
                'Dywen',
                'Jon Snow (MoD)',
                'Sworn to the Watch'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.dywen = this.player1.findCardByName('Dywen');
            this.jon = this.player1.findCardByName('Jon Snow');
            this.sworn = this.player1.findCardByName('Sworn to the Watch');
            this.player1.clickCard(this.dywen);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('after Dywen is declared as an attacker in a military challenge', function () {
            beforeEach(function () {
                this.completeMarshalPhase();
            });

            it('it should not kneel dywen', function () {
                expect(this.dywen.kneeled).toBe(false);
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.dywen);
                this.player1.clickPrompt('Done');
                expect(this.dywen.isParticipating()).toBe(true);
                expect(this.dywen.kneeled).toBe(false);
            });
        });

        describe('after a nightswatch character with stealth is declared as an attacker in a military challenge', function () {
            beforeEach(function () {
                this.player1.clickCard(this.jon);
                this.player1.clickCard(this.sworn);
                this.player1.clickCard(this.jon);
                this.completeMarshalPhase();
            });

            it('it should not kneel that character', function () {
                expect(this.jon.kneeled).toBe(false);
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.jon);
                this.player1.clickPrompt('Done');
                expect(this.jon.isParticipating()).toBe(true);
                expect(this.jon.kneeled).toBe(false);
            });
        });
    });
});
