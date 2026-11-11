describe("Nagga's Ribs", function () {
    describe('when a character is discarded', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    plotDeck: ['Marched to the Wall'],
                    inPlay: ['Theon Greyjoy (Core)', "Nagga's Ribs"]
                },
                player2: { inPlay: ['Hedge Knight'] }
            });
            this.player1.selectPlot('Marched to the Wall');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
            this.player1.clickCard(this.theonGreyjoy);
            this.player2.clickCard(this.hedgeKnight);
            this.player1.triggerAbility("Nagga's Ribs");
        });

        it('moves it to your dead pile', function () {
            expect(this.theonGreyjoy.location).toBe('dead pile');
            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a dupe is discarded', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: [{ card: 'Theon Greyjoy (Core)', dupes: 1 }, "Nagga's Ribs"] },
                player2: { inPlay: ['Hedge Knight'], hand: ["Mutiny At Craster's Keep"] }
            });
            [this.dupe] = this.theonGreyjoy.dupes;
            this.player2.togglePromptedActionWindow('dominance', true);
            this.completeChallengesPhase();
            this.player1.clickPrompt('Pass');
            this.player2.clickCard(this.mutinyAtCrastersKeep);
            this.player2.clickCard(this.hedgeKnight);
            this.player2.clickCard(this.theonGreyjoy);
            this.player1.triggerAbility("Nagga's Ribs");
        });

        it('moves the dupe to your dead pile', function () {
            expect(this.dupe.location).toBe('dead pile');
            expect(this.theonGreyjoy.location).toBe('play area');
        });
    });

    describe('vs Now My Watch Begins', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Theon Greyjoy (Core)', "Nagga's Ribs"] },
                player2: {
                    inPlay: ['Hedge Knight'],
                    hand: ["Mutiny At Craster's Keep", 'Now My Watch Begins']
                }
            });
            this.player2.togglePromptedActionWindow('dominance', true);
            this.completeChallengesPhase();
            this.player1.clickPrompt('Pass');
            this.player2.clickCard(this.mutinyAtCrastersKeep);
            this.player2.clickCard(this.hedgeKnight);
            this.player2.clickCard(this.theonGreyjoy);
        });

        it('is not offered once Now My Watch Begins has taken the character', function () {
            this.player1.clickPrompt('Pass');
            this.player2.triggerAbility('Now My Watch Begins');

            expect(this.player1).not.toAllowAbilityTrigger("Nagga's Ribs");
        });

        it("stops Now My Watch Begins once Nagga's Ribs has moved the character", function () {
            this.player1.triggerAbility("Nagga's Ribs");

            expect(this.player2).not.toAllowAbilityTrigger('Now My Watch Begins');
        });
    });
});
