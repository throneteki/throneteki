describe('Golden Company (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'targaryen',
                inPlay: [
                    { card: 'Golden Company (HMW)', gold: 2 },
                    { card: 'Orphan of the Greenblood', gold: 1 }
                ]
            }
        });
        this.player1.clickCard(this.orphanOfTheGreenblood);
        this.player1.clickCard(this.goldenCompany);
        this.player1.triggerAbility(this.goldenCompany);
    });

    it('has renown while it has gold, and discards 1 gold to save a Mercenary character that would be returned to your hand', function () {
        expect(this.goldenCompany.location).toBe('play area');
        expect(this.goldenCompany.gold).toBe(1);
        expect(this.goldenCompany.hasKeyword('renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
