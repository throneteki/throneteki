describe('Highgarden Treasury', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Highgarden Treasury', 'Robb Stark (AtSK)', 'Tumblestone Knight']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.robbStark);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.robbStark);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('gains 1 gold after a character is removed from a challenge', function () {
        const gold = this.player1Object.gold;
        this.player1.triggerAbility(this.highgardenTreasury);

        expect(this.player1Object.gold).toBe(gold + 1);

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
