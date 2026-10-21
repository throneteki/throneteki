describe('Megga Tyrell', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Megga Tyrell', 'Robb Stark (AtSK)', 'Tumblestone Knight']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.robbStark);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.robbStark);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('gains 1 power for your faction after characters are removed from a challenge', function () {
        this.player1.triggerAbility(this.meggaTyrell);

        expect(this.player1Object.faction.power).toBe(1);

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
