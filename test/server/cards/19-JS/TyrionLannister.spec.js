describe('Tyrion Lannister (JS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'targaryen',
                inPlay: [{ card: 'Tyrion Lannister (JS)', gold: 1 }],
                discard: ['Salladhor Saan (TC)']
            }
        });
        this.player1.clickCard(this.tyrionLannister);
        this.player1.clickCard(this.salladhorSaan);
    });

    it("discards 1 gold to put a Mercenary from a discard pile into play under your control, and places it on the bottom of its owner's deck at the end of the phase", function () {
        expect(this.salladhorSaan.location).toBe('play area');

        this.completeMarshalPhase();

        expect(this.salladhorSaan.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
