describe('Nightfire Visions', function () {
    integration(function () {
        describe('plot reveal delayed effect', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('baratheon', [
                    'A Noble Cause',
                    'A Storm of Swords',
                    'A Game of Thrones',
                    { name: 'Fiery Followers', count: 10 },
                    { name: 'Nightfire Visions', count: 10 }
                ]);
                const deck2 = this.buildDeck('lannister', [
                    'A Noble Cause',
                    'A Storm of Swords',
                    'A Game of Thrones',
                    'Burned Men'
                ]);

                this.player1.togglePromptedActionWindow('taxation', true);

                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Fiery Followers', 'draw deck');
                this.event = this.player1.findCardByName('Nightfire Visions', 'draw deck');

                this.player1.dragCard(this.character, 'hand');
                this.player1.dragCard(this.event, 'hand');

                this.player1.clickCard(this.character);

                this.completeSetup();

                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
                this.completeChallengesPhase();

                // Skip discarding down to reserve
                this.player1.clickPrompt('Done');

                this.player1.clickCard(this.event);
                this.player1.nameTrait('War');

                this.player2.clickPrompt('Pass');
                this.player1.clickPrompt('Pass');

                expect(this.player1Object.hand.length).toBe(9);
            });

            describe('when the opponent reveals a plot with that trait', function () {
                beforeEach(function () {
                    this.player1.selectPlot('A Storm of Swords');
                    this.player2.selectPlot('A Storm of Swords');
                    this.selectFirstPlayer(this.player1);
                });

                it('draws cards', function () {
                    // 9 cards at start of the round + 3 from Vision + 2 from draw phase
                    expect(this.player1Object.hand.length).toBe(14);
                });
            });

            describe('when the opponent does not reveal a plot with that trait', function () {
                beforeEach(function () {
                    this.player1.selectPlot('A Storm of Swords');
                    this.player2.selectPlot('A Game of Thrones');
                    this.selectFirstPlayer(this.player1);
                });

                it('does not draw cards', function () {
                    // 9 cards at start of the round + 2 from draw phase
                    expect(this.player1Object.hand.length).toBe(11);
                });
            });
        });
    });
});
