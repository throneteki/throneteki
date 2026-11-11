describe('Hellholt', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', inPlay: ['Hellholt'] },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.hellholt);
    });

    it('gains 1 power after you lose a challenge by 5 or more STR', function () {
        expect(this.hellholt.power).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
