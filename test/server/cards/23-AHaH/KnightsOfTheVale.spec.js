describe('Knights of the Vale (AHaH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Knights of the Vale (AHaH)', 'Tumblestone Knight', 'The Kingsroad']
            },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.knightsOfTheVale);
        this.player1.clickCard(this.theKingsroad);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels a neutral location to give a defending character that shares a Trait with it +STR until the end of the challenge', function () {
        expect(this.theKingsroad.kneeled).toBe(true);
        expect(this.tumblestoneKnight.getStrength()).toBeGreaterThan(2);
        expect(this.player2).isReadyToTakeAction();
    });
});
