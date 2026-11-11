describe('Gold Cloaks', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Gold Cloaks', 'Nightmares'] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.player1.clickCard(this.goldCloaks);
    });

    it('is discarded from play when the phase it was ambushed in ends', function () {
        this.completeChallengesPhase();

        expect(this.goldCloaks.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('is not discarded if it is blanked during the phase it was ambushed in', function () {
        this.player1.clickCard(this.nightmares);
        this.player1.clickCard(this.goldCloaks);
        this.completeChallengesPhase();

        expect(this.goldCloaks.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
