describe('A Mission in Essos (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                shadows: ['A Mission in Essos (R)'],
                inPlay: ['Arianne Martell (Core)'],
                drawDeck: ['Sansa Stark (Core)', 'Tumblestone Knight']
            }
        });
        this.player1.clickCard(this.aMissionInEssos);
        this.player1.clickCard(this.arianneMartell);
    });

    it('returns a martell character to your hand, then puts a cheaper character sharing a Trait into play from your deck', function () {
        expect(this.arianneMartell.location).toBe('hand');
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.sansaStark);

        expect(this.sansaStark.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
