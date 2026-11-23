describe('Doreah', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Doreah', 'Joffrey Baratheon (Core)']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.joffreyBaratheon);
        this.player1.clickPrompt('Done');
    });

    it('gains insight during a challenge in which you control a participating Lord or Lady', function () {
        expect(this.doreah.hasKeyword('Insight')).toBe(true);

        this.declareNoDefenders(this.player2);

        expect(this.player1).isReadyToTakeAction();
    });
});
