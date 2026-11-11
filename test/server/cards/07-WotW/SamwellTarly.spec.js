describe('Samwell Tarly (WotW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Samwell Tarly (WotW)', 'Grand Maester Pycelle (Core)']
            }
        });

        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.samwellTarly);
        this.player1.clickCard(this.grandMaesterPycelle);
        this.player1.clickPrompt('Done');
    });

    it('treats each other participating non-Steward character as blank while he participates', function () {
        expect(this.grandMaesterPycelle.hasKeyword('Insight')).toBe(false);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
