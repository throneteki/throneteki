describe('Bowels of Casterly Rock', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Bowels of Casterly Rock'],
                shadows: ['Ser Andrey Dalt']
            }
        });

        this.player1.clickCard(this.serAndreyDalt);
        this.player1.triggerAbility(this.bowelsOfCasterlyRock);
    });

    it('gains 2 gold or draws 1 card after a card you control comes out of shadows', function () {
        this.player1.clickPrompt('Gain 2 gold');

        expect(this.player1Object.gold).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
