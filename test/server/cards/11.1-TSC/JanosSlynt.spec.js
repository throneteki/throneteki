describe('Janos Slynt (TSC)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Old Forest Hunter', 'Winterfell Steward'],
                shadows: ['Janos Slynt (TSC)']
            }
        });
        this.player1.clickCard(this.janosSlynt);
    });

    it("sacrifices a Night's Watch character after he comes out of shadows", function () {
        expect(this.player1).toBeAbleToSelect(this.janosSlynt);
        expect(this.player1).toBeAbleToSelect(this.oldForestHunter);
        expect(this.player1).not.toBeAbleToSelect(this.winterfellSteward);
        this.player1.clickCard(this.oldForestHunter);
        expect(this.oldForestHunter.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
