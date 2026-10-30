describe('Dragon Sight', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                hand: ['Dragon Sight'],
                inPlay: ['Khal Drogo (Core)'],
                gold: 1
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.dragonSight);
    });

    it('gives each participating non-Dragon character -1 STR until the end of the challenge', function () {
        expect(this.khalDrogo.getStrength()).toBe(4);
        expect(this.player2).isReadyToTakeAction();
    });
});
