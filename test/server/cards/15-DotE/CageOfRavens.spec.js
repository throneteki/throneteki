describe('Cage of Ravens', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [{ card: 'Lannisport Merchant', attachments: ['Cage of Ravens'] }],
                hand: ['Wily Smuggler', 'Steward at the Wall']
            }
        });
        this.player1.clickMenu(this.cageOfRavens, 'Put card into play');
    });

    it('puts a card with printed cost 1 or lower into play from hand', function () {
        expect(this.player1).toAllowSelect(this.stewardAtTheWall);
        expect(this.player1).not.toAllowSelect(this.wilySmuggler);
        this.player1.clickCard(this.stewardAtTheWall);
        expect(this.cageOfRavens.kneeled).toBe(true);
        expect(this.stewardAtTheWall.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
