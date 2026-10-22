describe('Blackwater Rush', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'baratheon',
                inPlay: ['Blackwater Rush', 'Bastard in Hiding'],
                shadows: ['Undercity Spymaster'],
                gold: 3
            }
        });
        this.player1.clickCard(this.undercitySpymaster);
        this.player1.triggerAbility(this.blackwaterRush);
        this.player1.clickCard(this.bastardInHiding);
    });

    it('kneels to give a baratheon character 1 power after a card you control comes out of shadows', function () {
        expect(this.blackwaterRush.kneeled).toBe(true);
        expect(this.bastardInHiding.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
