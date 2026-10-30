describe('The Knight of Flowers (AtG)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'tyrell',
                inPlay: [
                    'The Knight of Flowers (AtG)',
                    { card: 'Ser Parmen Crane', kneeling: true }
                ],
                shadows: ['Undercity Spymaster'],
                gold: 3
            }
        });
        this.player1.clickCard(this.undercitySpymaster);
        this.player1.triggerAbility(this.theKnightOfFlowers);
        this.player1.clickCard(this.serParmenCrane);
    });

    it('has renown, and stands a Kingsguard character after a card you control comes out of shadows', function () {
        expect(this.theKnightOfFlowers.hasKeyword('renown')).toBe(true);
        expect(this.serParmenCrane.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
