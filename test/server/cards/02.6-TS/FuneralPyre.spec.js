describe('Funeral Pyre', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                inPlay: ['Eddard Stark (Core)'],
                hand: ['Funeral Pyre']
            },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.eddardStark);
        this.player1.triggerAbility(this.funeralPyre);
    });

    it('kneels your faction card to draw 3 cards after a Lord or Lady character is killed', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1Object.hand).toHaveLength(3);
        expect(this.player2).isReadyToTakeAction();
    });
});
