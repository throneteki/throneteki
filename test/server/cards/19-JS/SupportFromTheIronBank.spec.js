describe('Support from the Iron Bank', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'baratheon',
                hand: ['Support from the Iron Bank', 'Sea Dragon Tower'],
                gold: 0
            }
        });
        this.player1.clickCard(this.supportFromTheIronBank);
    });

    it('reduces the cost of each baratheon non-character card you marshal or play this phase by 1', function () {
        this.player1.clickCard(this.seaDragonTower);

        expect(this.seaDragonTower.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
