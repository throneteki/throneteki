describe('Incinerate', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                inPlay: ['Hedge Knight'],
                hand: ['Incinerate', 'Burned Men', 'Winterfell Steward', 'Tumblestone Knight'],
                gold: 5
            },
            player2: { inPlay: ['Robb Stark (Core)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.incinerate);
    });

    it('gives a participating character -2 STR until the end of the challenge for each card discarded from your hand', function () {
        expect(this.player1).not.toBeAbleToSelect(this.robbStark);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.burnedMen);
        this.player1.clickCard(this.winterfellSteward);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('discard pile');
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.hedgeKnight.getStrength()).toBe(0);
    });
});

describe('Incinerate with a discard that puts the card elsewhere', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                plot: 'Blood of the Dragon',
                inPlay: ['Hedge Knight'],
                hand: ['Incinerate', 'Missandei'],
                gold: 5
            },
            player2: {}
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.incinerate);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.missandei);
        this.player1.clickPrompt('Done');
    });

    it('counts a card that Missandei puts into play instead of the discard pile', function () {
        this.player1.triggerAbility('Missandei');
        expect(this.missandei.location).toBe('play area');
        expect(this.hedgeKnight.location).toBe('dead pile');
    });
});
