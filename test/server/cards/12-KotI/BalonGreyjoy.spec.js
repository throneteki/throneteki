describe('Balon Greyjoy (KotI)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'greyjoy', inPlay: ['Balon Greyjoy (KotI)'] },
            player2: { discard: ['Burned Men'] }
        });
        this.player1.clickCard(this.balonGreyjoy);
        this.player1.clickCard(this.burnedMen);
    });

    it("kneels your faction card to put a card from an opponent's discard pile into play under your control, and shuffles it into its owner's deck at the end of the phase", function () {
        expect(this.burnedMen.controller).toBe(this.player1Object);

        this.completeMarshalPhase();

        expect(this.burnedMen.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
