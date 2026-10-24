describe('Wardens of the South', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'tyrell',
                plot: 'Wardens of the South',
                inPlay: ['Margaery Tyrell (Core)']
            }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.margaeryTyrell);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.wardensOfTheSouth);
    });

    it('gives a tyrell character you control +2 STR until the end of the challenge after it is declared as an attacker or defender', function () {
        expect(this.margaeryTyrell.getStrength()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
