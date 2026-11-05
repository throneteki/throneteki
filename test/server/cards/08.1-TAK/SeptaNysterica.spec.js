describe('Septa Nysterica', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Septa Nysterica'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.septaNysterica);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to stand an attacking character with STR 4 or lower and remove it from the challenge', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.tumblestoneKnight.isParticipating()).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
