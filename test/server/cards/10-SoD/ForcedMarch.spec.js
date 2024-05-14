describe('Forced March', function () {
    integration(function () {
        describe('when revealed', function () {
            beforeEach(function () {
                const deck = this.buildDeck('targaryen', [
                    'Forced March (SoD)',
                    'A Noble Cause',
                    'Hedge Knight',
                    'Hedge Knight',
                    'Hedge Knight'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                [this.char1, this.char2, this.char3] =
                    this.player1.filterCardsByName('Hedge Knight');
                [this.opponentChar1, this.opponentChar2, this.opponentChar3] =
                    this.player2.filterCardsByName('Hedge Knight');

                this.player1.clickCard(this.char1);
                this.player1.clickCard(this.char2);
                this.player1.clickCard(this.char3);
                this.player2.clickCard(this.opponentChar1);
                this.player2.clickCard(this.opponentChar2);

                this.completeSetup();

                this.player1.selectPlot('Forced March');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player2.clickCard(this.opponentChar1);
            });

            it('requires each opponent to kneel a military character', function () {
                expect(this.opponentChar1.kneeled).toBe(true);
            });

            it('prompts to re-initiate', function () {
                expect(this.player1).toHavePrompt('Select card to kneel');
            });

            describe('when there are no more valid targets to kneel', function () {
                beforeEach(function () {
                    // Kneel another to initiate again
                    this.player1.clickCard(this.char1);

                    this.player2.clickCard(this.opponentChar2);
                });

                it('does not prompt to re-initiate', function () {
                    expect(this.player1).toHavePrompt('Marshal your cards');
                });
            });
        });

        describe('vs cancels', function () {
            beforeEach(function () {
                const deck = this.buildDeck('targaryen', [
                    'Forced March (SoD)',
                    'A Noble Cause',
                    'Outwit',
                    'Hedge Knight',
                    'Hedge Knight',
                    'Hedge Knight',
                    'Maester Wendamyr'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                [this.char1, this.char2, this.char3] =
                    this.player1.filterCardsByName('Hedge Knight');
                [this.opponentChar1, this.opponentChar2, this.opponentChar3] =
                    this.player2.filterCardsByName('Hedge Knight');
                this.maester = this.player2.findCardByName('Maester Wendamyr');
                this.outwit = this.player2.findCardByName('Outwit');

                this.player1.clickCard(this.char1);
                this.player1.clickCard(this.char2);
                this.player1.clickCard(this.char3);
                this.player2.clickCard(this.opponentChar1);
                this.player2.clickCard(this.opponentChar2);
                this.player2.clickCard(this.maester);

                this.completeSetup();

                this.player1.selectPlot('Forced March');
                this.player2.selectPlot('Outwit');
                this.selectFirstPlayer(this.player1);

                this.player2.clickCard(this.opponentChar1);

                // Pass Outwit for original initiation
                this.player2.clickPrompt('Pass');

                // Kneel another to initiate again
                this.player1.clickCard(this.char1);

                // Choose it
                this.player2.clickCard(this.opponentChar2);
            });

            it('gives another chance to cancel', function () {
                expect(this.player2).toAllowAbilityTrigger(this.outwit);
            });
        });
    });
});
