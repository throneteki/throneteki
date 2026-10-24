describe('Arianne Martell (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Arianne Martell (Core)', 'Hedge Knight'],
                hand: ['Ramsay Snow', 'Tumblestone Knight']
            }
        });
    });

    it('puts a character into play from your hand, then returns herself to your hand', function () {
        this.player1.clickMenu(this.arianneMartell, 'Put character into play');
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.arianneMartell.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });

    describe("when Ramsay Snow is put into play using Arianne's ability", function () {
        beforeEach(function () {
            this.player1.clickMenu(this.arianneMartell, 'Put character into play');
            this.player1.clickCard(this.ramsaySnow);
        });

        it('does not allow Arianne to be sacrificed', function () {
            expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
            expect(this.player1).not.toBeAbleToSelect(this.arianneMartell);
            expect(this.arianneMartell.location).toBe('hand');

            this.player1.clickCard(this.hedgeKnight);

            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
