describe('Mace Tyrell', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                'A Noble Cause',
                'Mace Tyrell (R)',
                'Left',
                'Left'
            ]);
            const deck2 = this.buildDeck('stark', ['A Noble Cause', 'Barring the Gates']);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.mace = this.player1.findCardByName('Mace Tyrell', 'hand');
            [this.character, this.characterCopy] = this.player1.filterCardsByName('Left', 'hand');

            this.player1.clickCard(this.mace);

            this.completeSetup();
        });

        describe('when removing a character from the game', function () {
            beforeEach(function () {
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.character);

                expect(this.character.location).toBe('play area');

                this.player1.triggerAbility('Mace Tyrell');

                this.player1.clickMenu(this.mace, 'Remove character from game');
                this.player1.clickCard(this.character);

                expect(this.character.location).toBe('out of game');

                this.completeMarshalPhase();
            });

            it('should return to play the following phase', function () {
                expect(this.character.location).toBe('play area');
            });
        });

        describe('when a removed character is placed in the dead pile', function () {
            beforeEach(function () {
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.character);

                expect(this.character.location).toBe('play area');

                this.player1.triggerAbility('Mace Tyrell');

                this.player1.clickMenu(this.mace, 'Remove character from game');
                this.player1.clickCard(this.character);

                expect(this.character.location).toBe('out of game');

                this.player1.dragCard(this.characterCopy, 'dead pile');

                this.completeMarshalPhase();
            });

            it('should not return to play the following phase', function () {
                expect(this.character.location).toBe('out of game');
            });
        });

        describe('vs Barring the Gates', function () {
            // Ruling: http://www.cardgamedb.com/forums/index.php?/topic/36886-mace-tyrell/

            beforeEach(function () {
                this.player2.selectPlot('Barring the Gates');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.character);

                expect(this.character.location).toBe('play area');

                this.player1.triggerAbility('Mace Tyrell');

                this.player1.clickMenu(this.mace, 'Remove character from game');
                this.player1.clickCard(this.character);

                expect(this.character.location).toBe('out of game');

                this.completeMarshalPhase();
            });

            it('should return to play the following phase', function () {
                expect(this.character.location).toBe('play area');
            });
        });
    });
});
