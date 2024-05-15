describe('Obara Sand (SoD)', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('martell', [
                'A Noble Cause',
                'Obara Sand (SoD)',
                'Arianne Martell (Core)',
                'Bastard Daughter',
                'Southron Messenger'
            ]);
            const deck2 = this.buildDeck('martell', ['A Noble Cause', 'House Dayne Knight']);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.obara = this.player1.findCardByName('Obara Sand', 'hand');
            this.arianne = this.player1.findCardByName('Arianne Martell', 'hand');
            this.character1 = this.player1.findCardByName('Bastard Daughter', 'hand');
            this.character2 = this.player1.findCardByName('Southron Messenger', 'hand');

            this.player1.clickCard(this.obara);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.player1.clickCard(this.arianne);
            this.completeMarshalPhase();
        });

        describe('when Obara is used multiple times', function () {
            beforeEach(function () {
                // Return Obara to hand to bring in a character
                this.player1.clickMenu(this.obara, 'Put character into play');
                this.player1.clickCard(this.obara);
                this.player1.clickCard(this.character1);

                expect(this.character1.location).toBe('play area');

                // Bring Obara back
                this.player1.clickMenu(this.arianne, 'Put character into play');
                this.player1.clickCard(this.obara);

                // Return Obara back to hand to bring in another character
                this.player1.clickMenu(this.obara, 'Put character into play');
                this.player1.clickCard(this.obara);
                this.player1.clickCard(this.character2);
            });

            it('should put the second character into play', function () {
                expect(this.character2.location).toBe('play area');
            });
        });
    });
});
