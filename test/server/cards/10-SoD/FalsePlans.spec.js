describe('False Plans', function () {
    it('has an opponent discard 1 card at random', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', hand: ['False Plans'], gold: 1 },
            player2: { hand: ['Hedge Knight'] }
        });
        this.player1.clickCard(this.falsePlans);
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not trigger when discarded other than for intrigue claim', function () {
        this.setupTest({
            phase: 'plot',
            player1: { faction: 'martell', hand: ['False Plans'] },
            player2: { plotDeck: ['Heads on Spikes'] }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Heads on Spikes');
        this.selectFirstPlayer(this.player1);
        expect(this.falsePlans.location).toBe('discard pile');
        expect(this.player1).not.toAllowAbilityTrigger('False Plans');
    });

    it('has the winning opponent discard 2 cards at random, at no cost, after being discarded for intrigue claim', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', hand: ['False Plans'], gold: 0 },
            player2: {
                inPlay: ['House Dayne Knight'],
                hand: ['Hedge Knight', 'Winterfell Steward']
            }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Intrigue', this.houseDayneKnight);
        this.player1.triggerAbility('False Plans');
        this.player2.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('discard pile');
    });

    it('does not trigger when intrigue claim is redirected back to you by Vengeance for Elia', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                inPlay: ['House Dayne Knight'],
                hand: ['False Plans']
            },
            player2: { faction: 'martell', hand: ['Vengeance for Elia'], gold: 2 }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.houseDayneKnight);
        this.player2.triggerAbility('Vengeance for Elia');
        expect(this.falsePlans.location).toBe('discard pile');
        expect(this.player1).not.toAllowAbilityTrigger('False Plans');
    });
});
