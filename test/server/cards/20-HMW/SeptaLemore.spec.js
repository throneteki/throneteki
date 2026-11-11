describe('Septa Lemore', function () {
    describe('when she leaves play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: { inPlay: ['Septa Lemore (HMW)', 'Aegon Targaryen (TSC)'] },
                player2: { inPlay: ['Castle Guard'] }
            });
            expect(this.aegonTargaryen.hasKeyword('Insight')).toBe(true);
            this.unopposedChallenge(this.player2, 'Military', this.castleGuard);
            this.player1.clickCard(this.septaLemore);
            this.player1.triggerAbility(this.septaLemore);
            this.player1.clickCard(this.aegonTargaryen);
        });

        it('gives Aegon insight, and returns a targaryen character with shadow to shadows', function () {
            expect(this.aegonTargaryen.location).toBe('shadows');
            expect(this.septaLemore.location).toBe('dead pile');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
