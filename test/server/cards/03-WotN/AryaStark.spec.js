describe('Arya Stark (WotN)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Arya Stark (WotN)', 'Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.burnedMen);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.aryaStark);
        this.player1.clickCard(this.burnedMen);
    });

    it('sacrifices herself to kill a character with STR 3 or lower after a stark character you control is killed', function () {
        expect(this.aryaStark.location).toBe('discard pile');
        expect(this.burnedMen.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
