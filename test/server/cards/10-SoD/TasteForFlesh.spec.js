describe('Taste For Flesh', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Lady (BtB)', 'Khal Drogo (Core)'], hand: ['Taste For Flesh'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.lady);
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.tasteForFlesh);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kills a defending character after you win a challenge with an attacking Direwolf', function () {
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
