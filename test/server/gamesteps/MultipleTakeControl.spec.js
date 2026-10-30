// FAQ v4.1, Multiple "Take Control" Effects: control follows the most recent take control effect.
// When it ends, control reverts to the player with the next most recent one, or to the owner.
describe('multiple take control effects', function () {
    describe('when the most recent effect ends', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player1',
                player1: {
                    faction: 'thenightswatch',
                    hand: ['Take the Black'],
                    inPlay: ['Maester Cressen (Core)']
                },
                player2: {
                    faction: 'stark',
                    hand: ['Ward (TS)'],
                    inPlay: ['Tumblestone Knight']
                }
            });

            this.player1.togglePromptedActionWindow('dominance', true);
            this.completeChallengesPhase();
            this.player1.clickCard(this.takeTheBlack);
            this.player1.clickCard(this.tumblestoneKnight);
        });

        it('gives control to the player with the most recent effect', function () {
            expect(this.tumblestoneKnight).toBeControlledBy(this.player1);

            this.marshalWard();

            expect(this.tumblestoneKnight).toBeControlledBy(this.player2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('reverts control to the player with the next most recent effect, not the owner', function () {
            this.marshalWard();
            this.player1.clickMenu(this.maesterCressen, 'Kneel to discard condition');
            this.player1.clickCard(this.ward);

            expect(this.ward.location).toBe('discard pile');
            expect(this.tumblestoneKnight).toBeControlledBy(this.player1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a newer effect applies while an older one is active', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                firstPlayer: 'player2',
                player1: {
                    faction: 'thenightswatch',
                    hand: ['Take the Black'],
                    inPlay: ['Tumblestone Knight']
                },
                player2: {
                    faction: 'stark',
                    hand: ['Ward (TS)']
                }
            });

            this.player1.togglePromptedActionWindow('dominance', true);
            this.player2.clickCard(this.ward);
            this.player2.clickCard(this.tumblestoneKnight);
            this.player2.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            this.completeChallengesPhase();
        });

        it('gives control to the newer effect without asking the first player', function () {
            expect(this.tumblestoneKnight).toBeControlledBy(this.player2);

            this.player2.clickPrompt('Pass');
            this.player1.clickCard(this.takeTheBlack);
            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.takeTheBlack.location).toBe('discard pile');
            expect(this.ward.location).toBe('play area');
            expect(this.tumblestoneKnight).toBeControlledBy(this.player1);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    beforeEach(function () {
        this.marshalWard = function () {
            this.player2.clickPrompt('Pass');
            this.player1.clickPrompt('Pass');
            this.completeRound();
            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player2);
            this.player2.clickCard(this.ward);
            this.player2.clickCard(this.tumblestoneKnight);
            this.player2.clickPrompt('Done');
        };
    });
});
