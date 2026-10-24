describe('Dragonstone Faithful', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                gold: 10,
                hand: ['House Maester', 'Bastard in Hiding'],
                inPlay: ['Dragonstone Faithful']
            }
        });

        this.player1.clickCard(this.dragonstoneFaithful);
    });

    it('kneels to reduce the cost of the next [baratheon] character you marshal this phase by 1', function () {
        expect(this.dragonstoneFaithful.kneeled).toBe(true);

        this.player1.clickCard(this.houseMaester);

        expect(this.player1Object.gold).toBe(8);

        this.player1.clickCard(this.bastardInHiding);

        expect(this.bastardInHiding.location).toBe('play area');
        expect(this.player1Object.gold).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
