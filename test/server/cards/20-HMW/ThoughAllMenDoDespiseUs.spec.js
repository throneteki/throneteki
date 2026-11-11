describe('Though All Men Do Despise Us (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Though All Men Do Despise Us (HMW)'],
                inPlay: ['Orkmont Reaver']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.orkmontReaver);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility(this.thoughAllMenDoDespiseUs);
    });

    it('gives each attacking Raider 1 power after no defenders are declared', function () {
        expect(this.orkmontReaver.power).toBe(1);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
