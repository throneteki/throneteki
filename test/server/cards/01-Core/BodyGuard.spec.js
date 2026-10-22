describe('Bodyguard', function () {
    describe('when the attached character would be killed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { inPlay: [{ card: 'Catelyn Stark (Core)', attachments: ['Bodyguard'] }] },
                player2: { plotDeck: ['Valar Morghulis'] }
            });
            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Valar Morghulis');
            this.selectFirstPlayer(this.player1);
            this.player1.triggerAbility(this.bodyguard);
        });

        it('is sacrificed to save the character', function () {
            expect(this.catelynStark.location).toBe('play area');
            expect(this.bodyguard.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the attached character would be discarded from play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: [{ card: 'Catelyn Stark (Core)', attachments: ['Bodyguard'] }] },
                player2: { inPlay: ['Varys (Core)'] }
            });
            this.player1.togglePromptedActionWindow('dominance', true);
            this.player1.togglePromptedActionWindow('standing', true);
            this.completeChallengesPhase();
            this.skipActionWindow();
            this.player2.triggerAbility(this.varys);
            this.player1.triggerAbility(this.bodyguard);
        });

        it('is sacrificed to save the character', function () {
            expect(this.catelynStark.location).toBe('play area');
            expect(this.bodyguard.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
