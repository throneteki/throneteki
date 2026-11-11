describe('Daggers in the Dark', function () {
    function setup(attackers) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ranging Party'], shadows: ['Daggers in the Dark'], gold: 2 },
            player2: { inPlay: attackers }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.rangingParty);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('Daggers in the Dark');
        this.player1.clickCard(this.hedgeKnight);
    }

    it('kills an attacking character after you win as the defender', function () {
        setup.call(this, ['Hedge Knight']);
        expect(this.hedgeKnight.location).toBe('dead pile');
    });

    it('lets the attacking player sacrifice 2 characters to cancel it', function () {
        setup.call(this, ['Hedge Knight', 'Castle Guard', 'Winterfell Steward']);
        this.player2.clickPrompt('Yes');
        this.player2.clickCard(this.castleGuard);
        this.player2.clickCard(this.winterfellSteward);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('discard pile');
    });

    it('kills it if they do not', function () {
        setup.call(this, ['Hedge Knight', 'Castle Guard']);
        this.player2.clickPrompt('No');
        expect(this.hedgeKnight.location).toBe('dead pile');
    });
});
