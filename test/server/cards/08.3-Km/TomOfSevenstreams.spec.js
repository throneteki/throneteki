describe('Tom of Sevenstreams', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tom of Sevenstreams', 'Tumblestone Knight'],
                hand: ['"Wolf in the Night"'],
                gold: 1
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.wolfInTheNight);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.tomOfSevenstreams);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('stands a non-loyal character you control after you play a Song event', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
