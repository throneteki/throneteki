describe('Bitterbridge Encampment', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Time of Plenty'],
                inPlay: ['Bitterbridge Encampment'],
                hand: ['Hedge Knight']
            },
            player2: { hand: ['Castle Guard'] }
        });
        this.player1.selectPlot('Time of Plenty');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility('Bitterbridge Encampment');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
    });

    it('kneels after a Summer plot is revealed to have each player put a character into play from hand', function () {
        expect(this.bitterbridgeEncampment.kneeled).toBe(true);
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.castleGuard.location).toBe('play area');
    });
});

describe('Bitterbridge Encampment with enters play reactions', function () {
    it('puts the characters into play together, so forced reactions resolve first', function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['A Song of Summer'],
                inPlay: ['Bitterbridge Encampment', 'Hedge Knight'],
                hand: ['House Florent Knight']
            },
            player2: { hand: ['Arya Stark (Core)'], inPlay: ['Bastard in Hiding'] }
        });
        this.player1.selectPlot('A Song of Summer');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player2);
        this.player1.triggerAbility('Bitterbridge Encampment');
        this.player2.clickCard(this.aryaStark);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.houseFlorentKnight);
        this.player1.clickPrompt('Done');

        expect(this.aryaStark.location).toBe('play area');
        expect(this.player1).toHavePrompt('Select a character');
        expect(this.player2).toHavePrompt('Waiting for opponent to use House Florent Knight');
    });
});
