describe('Lonely Light', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Lonely Light'],
                shadows: ['Ser Andrey Dalt']
            }
        });
    });

    it('increases the cost to bring cards out of shadows by 1 while standing, and gives +1 reserve', function () {
        this.player1.clickCard(this.serAndreyDalt);

        expect(this.serAndreyDalt.location).toBe('play area');
        expect(this.player1Object.gold).toBe(1);
        expect(this.player1Object.getReserve()).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
