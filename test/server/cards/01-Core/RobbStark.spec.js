describe('Robb Stark (Core)', function () {
    describe('after a stark character you control is killed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: {
                    inPlay: [
                        'Robb Stark (Core)',
                        'Winterfell Steward',
                        { card: 'Tumblestone Knight', kneeling: true }
                    ]
                },
                player2: { inPlay: ['Castle Guard'] }
            });
            this.unopposedChallenge(this.player2, 'Military', this.castleGuard);
            this.player1.clickCard(this.winterfellSteward);
            this.player1.triggerAbility(this.robbStark);
        });

        it('stands each character you control', function () {
            expect(this.tumblestoneKnight.kneeled).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
