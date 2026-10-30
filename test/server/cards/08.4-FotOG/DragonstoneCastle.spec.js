describe('Dragonstone Castle', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'baratheon',
                hand: ['Dragonstone Castle'],
                inPlay: ['Tumblestone Knight'],
                gold: 3
            }
        });
        this.player1.clickCard(this.dragonstoneCastle);
        this.completeMarshalPhase();
        this.player1.triggerAbility(this.dragonstoneCastle);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to stop a character standing until the end of the phase after a phase begins', function () {
        expect(this.dragonstoneCastle.kneeled).toBe(true);
        expect(this.tumblestoneKnight.allowGameAction('stand')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
