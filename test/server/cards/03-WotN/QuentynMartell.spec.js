describe('Quentyn Martell (WotN)', function () {
    describe('while you are not the first player', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: { inPlay: ['Quentyn Martell (WotN)'] },
                player2: { inPlay: ['Castle Guard', 'Hedge Knight'] }
            });
            expect(this.quentynMartell.getStrength()).toBe(5);
            expect(this.quentynMartell.hasKeyword('Stealth')).toBe(true);
            this.unopposedChallenge(this.player2, 'Military', this.castleGuard);
            this.player1.clickCard(this.quentynMartell);
            this.player1.triggerAbility(this.quentynMartell);
        });

        it('gets +1 STR and stealth, and kills a character with lower STR when he is killed', function () {
            expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
            expect(this.player1).toBeAbleToSelect(this.castleGuard);
            this.player1.clickCard(this.hedgeKnight);
            expect(this.hedgeKnight.location).toBe('dead pile');
            expect(this.quentynMartell.location).toBe('dead pile');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
