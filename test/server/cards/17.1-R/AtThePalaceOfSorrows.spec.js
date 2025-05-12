describe('At the Palace of Sorrows', function () {
    integration(function () {
        beforeEach(function () {
            let deck = this.buildDeck('Tyrell', [
                'At the Palace of Sorrows (R)',
                'Randyll Tarly (Core)',
                'Strangler',
                'Highgarden (Core)'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);

            this.startGame();
            this.keepStartingHands();

            this.randyll = this.player1.findCardByName('Randyll Tarly (Core)', 'hand');
            this.strangler = this.player1.findCardByName('Strangler', 'hand');
            this.highgarden = this.player1.findCardByName('Highgarden (Core)', 'hand');

            this.player1.clickCard(this.randyll);
            this.player1.clickCard(this.strangler);

            this.completeSetup();
            this.player1.clickCard(this.strangler);
            this.player1.clickCard(this.randyll);
            this.selectFirstPlayer(this.player1);
        });

        it('should not prevent strangler applying during a challenge', function () {
            expect(this.randyll.getStrength()).toBe(3);
            this.completeMarshalPhase();
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.randyll);
            this.player1.clickPrompt('Done');
            expect(this.randyll.getStrength()).toBe(1);
        });

        it('should apply after a character with strangler is removed from a challenge', function () {
            this.player1.clickCard(this.highgarden);
            this.completeMarshalPhase();
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.randyll);
            this.player1.clickPrompt('Done');
            this.player1.clickMenu('Highgarden', 'Remove character from challenge');
            this.player1.clickCard(this.randyll);
            expect(this.randyll.getStrength()).toBe(3);
        });

        it('should apply after a challenge featuring a character with strangler ends', function () {
            this.completeMarshalPhase();
            this.unopposedChallenge(this.player1, 'power', this.randyll);
            this.player1.clickPrompt('apply claim');
            expect(this.randyll.getStrength()).toBe(3);
        });
    });
});
