describe('The Wall (Core)', function () {
    describe('when dupes are put out in the setup phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['The Wall (Core)', 'The Wall (Core)', 'Steward at the Wall'] }
            });
        });

        it('does not count duplicates toward character strength', function () {
            expect(this.theWall.dupes).toHaveLength(1);
            expect(this.player1Object.cardsInPlay).toHaveLength(2);
            expect(this.stewardAtTheWall.getStrength()).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('in the challenges phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['The Wall (Core)', 'Steward at the Wall'] },
                player2: { inPlay: ['Castle Guard'] }
            });
        });

        it('kneels after you lose an unopposed challenge', function () {
            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Power', this.castleGuard);

            expect(this.theWall.kneeled).toBe(true);
            expect(this.player2).isReadyToTakeAction();
        });

        it('kneels to gain 2 power for your faction when the challenges phase ends', function () {
            this.player1.togglePromptedActionWindow('dominance', true);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            this.player1.triggerAbility(this.theWall);

            expect(this.theWall.kneeled).toBe(true);
            expect(this.player1Object.faction.power).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
