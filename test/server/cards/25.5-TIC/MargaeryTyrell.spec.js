describe('Margaery Tyrell (TIC)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Margaery Tyrell (TIC)'],
                hand: ['Oldtown City Watch'],
                drawDeck: ['Mace Tyrell (HoT)']
            }
        });
        this.player1.clickCard(this.oldtownCityWatch);
        this.player1.triggerAbility(this.oldtownCityWatch);
        this.player1.triggerAbility(this.margaeryTyrell);
    });

    it('places a tyrell card revealed from your deck in shadows', function () {
        this.player1.clickCard(this.maceTyrell);

        expect(this.maceTyrell.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
