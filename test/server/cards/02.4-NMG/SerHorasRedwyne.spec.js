describe('Ser Horas Redwyne', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'tyrell',
                inPlay: ['Ser Horas Redwyne', { card: 'Margaery Tyrell (Core)', kneeling: true }]
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.serHorasRedwyne);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.serHorasRedwyne);
        this.player1.clickCard(this.margaeryTyrell);
    });

    it('stands a Lady character after he kneels', function () {
        expect(this.margaeryTyrell.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
