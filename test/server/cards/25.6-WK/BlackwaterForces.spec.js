describe('Blackwater Forces (WK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Blackwater Forces (WK)', kneeling: true }, 'Tumblestone Knight'],
                hand: ['Defiance']
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.defiance);
        this.player1.clickCard(this.blackwaterForces);
        this.player1.triggerAbility(this.blackwaterForces);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('gives a participating character +2 STR after it stands during a challenge', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(4);
        expect(this.player2).isReadyToTakeAction();
    });
});
