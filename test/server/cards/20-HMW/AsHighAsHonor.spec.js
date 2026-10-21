describe('As High as Honor (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['As High as Honor (HMW)', 'Harry the Heir', 'Tumblestone Knight'],
                inPlay: ['The Kingsroad']
            }
        });
        this.player1.clickCard(this.asHighAsHonor);
    });

    it('kneels a neutral location to put a neutral card into play knelt, then stands it if it is House Arryn', function () {
        this.player1.clickCard(this.theKingsroad);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);
        this.player1.clickCard(this.harryTheHeir);

        expect(this.theKingsroad.kneeled).toBe(true);
        expect(this.harryTheHeir.location).toBe('play area');
        expect(this.harryTheHeir.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
