describe('Maester Kerwin', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'greyjoy', inPlay: ['Maester Kerwin', 'Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.maesterKerwin);
    });

    it('kills himself to save another character that would be killed', function () {
        expect(this.maesterKerwin.location).toBe('dead pile');
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});

describe('Maester Kerwin under Valar Morghulis', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { inPlay: ['Maester Kerwin', 'Hedge Knight'] },
            player2: { plotDeck: ['Valar Morghulis'] }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Valar Morghulis');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility(this.maesterKerwin);
    });

    it('can kill himself to save another character, although he is already being killed', function () {
        expect(this.maesterKerwin.location).toBe('dead pile');
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.game.getPlainTextLog()).toContain(
            'player1 kills Maester Kerwin to save Hedge Knight'
        );
    });
});
