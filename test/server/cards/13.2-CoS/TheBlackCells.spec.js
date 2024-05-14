describe('The Black Cells', function () {
    integration(function () {
        describe('cannot kneel effect', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('baratheon', ['Marching Orders', 'The Black Cells']);
                const deck2 = this.buildDeck('lannister', [
                    'Marching Orders',
                    'Ser Jaime Lannister (Core)',
                    'Burned Men'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.blackCells = this.player1.findCardByName('The Black Cells', 'hand');

                this.nonKneelingCharacter = this.player2.findCardByName('Ser Jaime Lannister');
                this.kneelingCharacter = this.player2.findCardByName('Burned Men');

                this.player1.clickCard(this.blackCells);
                this.player1.clickPrompt('Setup in shadows');

                this.player2.clickCard(this.nonKneelingCharacter);
                this.player2.clickCard(this.kneelingCharacter);

                this.completeSetup();

                this.selectFirstPlayer(this.player2);

                this.completeMarshalPhase();
            });

            describe('when a character is required to kneel for challenges', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.blackCells);
                    this.player1.triggerAbility(this.blackCells);
                    this.player1.clickCard(this.kneelingCharacter);

                    this.player2.clickPrompt('Military');
                });

                it('does not allow the character to be declared', function () {
                    let selectState = this.player2Object.getCardSelectionState(
                        this.kneelingCharacter
                    );
                    expect(selectState.selectable).toBe(false);
                });
            });

            describe('when a character is not required to kneel for challenges', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.blackCells);
                    this.player1.triggerAbility(this.blackCells);
                    this.player1.clickCard(this.nonKneelingCharacter);

                    this.player2.clickPrompt('Military');
                });

                it('allows the character to be declared', function () {
                    let selectState = this.player2Object.getCardSelectionState(
                        this.nonKneelingCharacter
                    );
                    expect(selectState.selectable).toBe(true);
                });
            });
        });
    });
});
