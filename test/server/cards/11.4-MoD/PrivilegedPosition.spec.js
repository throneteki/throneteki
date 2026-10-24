describe('Privileged Position', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Privileged Position'] },
            player2: { inPlay: ['Dragonstone Faithful', 'Dragonstone Port'] }
        });
        this.player1.clickPrompt('Done');
    });

    it("cancels an opponent's triggered location ability", function () {
        this.player2.clickPrompt('Done');
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.dragonstonePort);

        expect(this.player1).toAllowAbilityTrigger(this.privilegedPosition);
        this.player1.triggerAbility(this.privilegedPosition);

        expect(this.privilegedPosition.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });

    it('can be played after losing a power challenge the previous round', function () {
        this.unopposedChallenge(this.player2, 'Power', this.dragonstoneFaithful);
        this.player2.clickPrompt('Done');
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.dragonstonePort);

        expect(this.player1).toAllowAbilityTrigger(this.privilegedPosition);
        this.player1.clickPrompt('Pass');
        expect(this.player2).isReadyToTakeAction();
    });
});
