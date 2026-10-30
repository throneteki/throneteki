describe('Dolorous Edd', function () {
    function enter(context, attacker = 'House Maester') {
        context.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { hand: ['Dolorous Edd', 'The Roseroad'], inPlay: ['Winterfell Steward'] },
            player2: { inPlay: [attacker] }
        });
        context.player2.clickPrompt('Intrigue');
        context.player2.clickCard(context.player2.findCardByName(attacker, 'play area'));
        context.player2.clickPrompt('Done');
        context.player2.clickPrompt('Pass');
        context.player1.clickCard(context.dolorousEdd);
        expect(context.dolorousEdd.location).toBe('play area');
        expect(context.dolorousEdd.kneeled).toBe(true);
        expect(context.dolorousEdd.isDefending()).toBe(true);
        expect(context.player1Object.faction.kneeled).toBe(true);
        expect(context.winterfellSteward.isDefending()).toBe(false);
        context.player2.clickPrompt('Pass');
        context.player1.clickPrompt('Pass');
        context.player1.clickPrompt('Done');
        context.skipActionWindow();
    }

    it('can return to hand after entering knelt as a defender and winning', function () {
        enter(this);
        expect(this.player1).toHavePrompt('Return Dolorous Edd to your hand?');
        this.player1.clickPrompt('Yes');
        expect(this.dolorousEdd.location).toBe('hand');
        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });

    it('may stay in play after winning', function () {
        enter(this);
        this.player1.clickPrompt('No');
        expect(this.dolorousEdd.location).toBe('play area');
        expect(this.dolorousEdd.kneeled).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });

    it('does not offer a return after losing the challenge', function () {
        enter(this, 'Littlefinger (Core)');
        expect(this.player1).not.toHavePrompt('Return Dolorous Edd to your hand?');
        expect(this.dolorousEdd.location).toBe('play area');
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });

    it('cannot enter outside an intrigue challenge', function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { hand: ['Dolorous Edd'] },
            player2: { inPlay: ['Ranging Party'] }
        });
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.rangingParty);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('Pass');
        expect(this.player1.actionUnavailableReason(this.dolorousEdd)).toBe('condition');
        expect(this.player1).isReadyToTakeAction();
    });
});
