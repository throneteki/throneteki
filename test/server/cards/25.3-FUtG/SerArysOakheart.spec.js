describe('Ser Arys Oakheart (FUtG)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Ser Arys Oakheart (FUtG)']
            },
            player2: {
                inPlay: ['Tumblestone Knight']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.serArysOakheart);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('makes the defending player declare at least 1 defender, if able, while he attacks', function () {
        this.player2.clickPrompt('Done');

        expect(this.game.currentChallenge.defenders).toEqual([]);
        expect(this.player2).toBeAbleToSelect(this.tumblestoneKnight);

        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');

        expect(this.game.currentChallenge.defenders).toEqual([this.tumblestoneKnight]);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
