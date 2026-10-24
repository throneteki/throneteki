describe('Khal Drogo (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'targaryen',
                inPlay: [
                    'Khal Drogo (DotE)',
                    'Unsullied',
                    { card: 'Orphan of the Greenblood', gold: 1 }
                ],
                hand: ['Burned Men']
            }
        });
        this.player1.clickCard(this.orphanOfTheGreenblood);
        this.player1.clickCard(this.unsullied);
        this.player1.triggerAbility(this.khalDrogo);
        this.player1.clickCard(this.burnedMen);
    });

    it('has renown, and discards a card from your hand to save an Army or Dothraki character that would be returned to your hand', function () {
        expect(this.khalDrogo.hasKeyword('renown')).toBe(true);
        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.unsullied.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
