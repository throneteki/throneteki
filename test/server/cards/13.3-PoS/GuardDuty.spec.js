describe('Guard Duty', function () {
    describe('after the attached character is declared as a defender', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: { inPlay: [{ card: 'Will', attachments: ['Guard Duty'] }] },
                player2: { inPlay: ['Castle Guard'] }
            });
            this.player2.clickPrompt('Military');
            this.player2.clickCard(this.castleGuard);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickCard(this.will);
            this.player1.clickPrompt('Done');
            this.player1.triggerAbility(this.guardDuty);
        });

        it('kneels to stand it', function () {
            expect(this.guardDuty.kneeled).toBe(true);
            expect(this.will.kneeled).toBe(false);
        });
    });
});
