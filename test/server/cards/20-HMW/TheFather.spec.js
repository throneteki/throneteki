describe('The Father', function () {
    describe('when the dominance phase ends', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    plot: 'The Father (HMW)',
                    inPlay: ['Eddard Stark (Core)', 'House Umber Berserkers', 'Tumblestone Knight']
                },
                player2: {
                    inPlay: ['Grand Maester Pycelle (Core)', 'Samwell Tarly (Core)']
                }
            });

            this.player1.togglePromptedActionWindow('dominance', true);
            this.completeChallengesPhase();
            this.player1.clickPrompt('Pass');
            this.player2.clickPrompt('Pass');
        });

        it('has each player choose a unique non-Army character they control', function () {
            expect(this.player1).toBeAbleToSelect(this.eddardStark);
            expect(this.player1).not.toBeAbleToSelect(this.houseUmberBerserkers);
            expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.grandMaesterPycelle);

            this.player1.clickCard(this.eddardStark);

            expect(this.player2).toBeAbleToSelect(this.grandMaesterPycelle);
            expect(this.player2).toBeAbleToSelect(this.samwellTarly);
            expect(this.player2).not.toBeAbleToSelect(this.eddardStark);

            this.player2.clickCard(this.grandMaesterPycelle);

            expect(this.player1).isReadyToTakeAction();
        });

        it("returns each chosen character to its owner's hand", function () {
            this.player1.clickCard(this.eddardStark);
            this.player2.clickCard(this.grandMaesterPycelle);

            expect(this.eddardStark.location).toBe('hand');
            expect(this.grandMaesterPycelle.location).toBe('hand');
            expect(this.samwellTarly.location).toBe('play area');
            expect(this.tumblestoneKnight.location).toBe('play area');
            expect(this.houseUmberBerserkers.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a player has no unique non-Army character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    plot: 'The Father (HMW)',
                    inPlay: ['Tumblestone Knight']
                },
                player2: {
                    inPlay: ['Grand Maester Pycelle (Core)']
                }
            });

            this.player1.togglePromptedActionWindow('dominance', true);
            this.completeChallengesPhase();
            this.player1.clickPrompt('Pass');
            this.player2.clickPrompt('Pass');
        });

        it("only returns the other player's chosen character", function () {
            this.player2.clickCard(this.grandMaesterPycelle);

            expect(this.grandMaesterPycelle.location).toBe('hand');
            expect(this.tumblestoneKnight.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
