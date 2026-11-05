describe('Tower of the Sun', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tower of the Sun', 'Khal Drogo (Core)'],
                hand: ['Dragon Sight'],
                gold: 1
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.dragonSight);
        this.player1.triggerAbility(this.towerOfTheSun);
    });

    it('gains 1 gold after an event is played', function () {
        expect(this.player1Object.gold).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
