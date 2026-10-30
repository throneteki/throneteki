describe('Alys Karstark', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Defiance'],
                inPlay: [{ card: 'Alys Karstark', kneeling: true }, 'Sigorn']
            }
        });
        this.player1.clickCard(this.defiance);
        this.player1.clickCard(this.alysKarstark);
        this.player1.triggerAbility(this.alysKarstark);
    });

    it('gives another Wildling you control 1 power after she stands, then draws 1 card if it was Sigorn', function () {
        this.player1.clickCard(this.sigorn);

        expect(this.sigorn.power).toBe(1);
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
