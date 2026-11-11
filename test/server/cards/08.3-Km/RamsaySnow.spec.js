describe('Ramsay Snow', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'stark',
                gold: 5,
                hand: ['Ramsay Snow'],
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['House Maester', 'Bastard in Hiding']
            }
        });

        this.player1.clickCard(this.ramsaySnow);
    });

    it('has each player sacrifice a character after he enters play', function () {
        expect(this.player1).toBeAbleToSelect(this.ramsaySnow);
        expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.player2).toBeAbleToSelect(this.houseMaester);
        this.player2.clickCard(this.houseMaester);

        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.houseMaester.location).toBe('discard pile');
        expect(this.bastardInHiding.location).toBe('play area');
        expect(this.ramsaySnow.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
