describe('Stannis Baratheon (TIMC)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'baratheon',
                inPlay: ['Stannis Baratheon (TIMC)', 'Tumblestone Knight']
            }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
    });

    it('gives participating non-King characters -1 STR during power challenges, and stops a non-loyal character standing after you win dominance', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(1);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.stannisBaratheon);
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
