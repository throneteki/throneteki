describe('"Loses all" related effects', function () {
    integration(function () {
        describe('Losing all traits via I Am No One', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'I Am No One (TFM)',
                    'Ser Colen of Greenpools',
                    'Knighted'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.knight = this.player1.findCardByName('Ser Colen of Greenpools');

                this.player1.clickCard(this.knight);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);
            });

            it('should remove all existing traits from the character', function () {
                this.player1.clickCard('I Am No One', 'hand');
                this.player1.clickCard(this.knight);

                expect(this.knight.hasTrait('Knight')).toBe(false);
            });

            it('should remove any traits that has multiple instances', function () {
                // Knight the character to give it an additional instance of the
                // trait
                this.player1.clickCard('Knighted', 'hand');
                this.player1.clickCard(this.knight);

                this.player1.clickCard('I Am No One', 'hand');
                this.player1.clickCard(this.knight);

                expect(this.knight.hasTrait('Knight')).toBe(false);
            });

            it('should prevent any traits from being gained while in effect', function () {
                // Clear any existing traits
                this.player1.clickCard('I Am No One', 'hand');
                this.player1.clickCard(this.knight);

                // Attempt to re-Knight the character
                this.player1.clickCard('Knighted', 'hand');
                this.player1.clickCard(this.knight);

                expect(this.knight.hasTrait('Knight')).toBe(false);
            });
        });
    });
});
