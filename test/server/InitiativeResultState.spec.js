describe('the initiative result in the game state', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['A Noble Cause', 'Filler Plot'] },
            player2: { plotDeck: ['Sneak Attack', 'Filler Plot'] }
        });
        this.stateFor = (wrapper) => this.game.getState(wrapper.player.name);
    });

    it('has no result before the plots are revealed', function () {
        expect(this.stateFor(this.player1).initiative).toBeUndefined();
        expect(this.player1).toHavePrompt('Select a plot');
    });

    it('names the winner and each player’s initiative and power, the same for every player', function () {
        this.player1.selectPlot('A Noble Cause');
        this.player2.selectPlot('Sneak Attack');
        this.selectFirstPlayer(this.player2);

        for (const viewer of [this.player1, this.player2]) {
            expect(this.stateFor(viewer).initiative).toEqual({
                round: this.game.round,
                winner: this.player2.player.name,
                values: [
                    { name: this.player1.player.name, initiative: 0, power: 0 },
                    { name: this.player2.player.name, initiative: 11, power: 0 }
                ],
                initiativeTied: false,
                powerTied: false,
                chosenBy: undefined
            });
        }
        expect(this.player2).isReadyToTakeAction();
    });

    it('says when initiative and power were both tied and the winner was chosen at random', function () {
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');

        const result = this.stateFor(this.player1).initiative;
        expect(result.initiativeTied).toBe(true);
        expect(result.powerTied).toBe(true);
        const winner = [this.player1, this.player2].find(
            (wrapper) => wrapper.player.name === result.winner
        );
        expect(winner).toBeDefined();

        this.selectFirstPlayer(winner);
        expect(winner).isReadyToTakeAction();
    });
});
