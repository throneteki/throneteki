describe('Silence (KotI)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Sweet Cersei'],
                inPlay: ['Silence (KotI)', { card: "Euron Crow's Eye (KotI)", kneeling: true }]
            }
        });
        this.player1.clickCard(this.silence);
        this.player1.clickCard(this.sweetCersei);
    });

    it("kneels to put a Warship location into play from your hand, then stands Euron Crow's Eye", function () {
        expect(this.sweetCersei.location).toBe('play area');
        expect(this.silence.kneeled).toBe(true);
        expect(this.euronCrowsEye.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
