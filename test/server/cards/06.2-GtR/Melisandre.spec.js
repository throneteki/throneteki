describe('Melisandre (GtR)', function () {
    function dominate(context, hand, losing = false) {
        context.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Melisandre (GtR)'], hand: ['The Kingsroad'], gold: 0 },
            player2: { hand, inPlay: ['Winterfell Steward'], gold: losing ? 10 : 0 }
        });
        context.player1.togglePromptedActionWindow('dominance', true);
        context.completeChallengesPhase();
    }

    for (const name of ['Hedge Knight', 'The Roseroad']) {
        it(`looks at the losers hand and discards ${name} to the appropriate pile`, function () {
            dominate(this, [name]);
            this.player1.triggerAbility('Melisandre');
            this.player1.clickPrompt('Done');
            const card = this.player2.findCardByName(name, 'hand');
            expect(this.player1).toBeAbleToSelect(card);
            expect(this.player1).not.toBeAbleToSelect(this.theKingsroad);
            expect(this.player1).not.toBeAbleToSelect(this.winterfellSteward);
            expect(this.player1).not.toBeAbleToSelect(this.melisandre);
            expect(this.player2).not.toHavePrompt('Select a card');
            this.player1.clickCard(card);
            expect(card.location).toBe(name === 'Hedge Knight' ? 'dead pile' : 'discard pile');
            expect(this.theKingsroad.location).toBe('hand');
            expect(this.winterfellSteward.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    }

    it('honors Missandeis discard replacement', function () {
        dominate(this, ['Missandei']);
        this.player1.triggerAbility('Melisandre');
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.missandei);
        this.player2.triggerAbility('Missandei');
        expect(this.missandei.location).toBe('play area');
        expect(this.player2Object.deadPile.length).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot react when another player wins dominance', function () {
        dominate(this, ['Hedge Knight'], true);
        expect(this.player1).not.toAllowAbilityTrigger('Melisandre');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot react against an empty hand', function () {
        dominate(this, []);
        expect(this.player1).not.toAllowAbilityTrigger('Melisandre');
        expect(this.player1).isReadyToTakeAction();
    });
});
