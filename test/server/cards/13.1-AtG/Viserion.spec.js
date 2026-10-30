describe('Viserion (AtG)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Viserion (AtG)'], hand: ['Aggo'] },
            player2: { inPlay: ['Targaryen Loyalist', 'Handmaiden'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.viserion);
    });

    it('discards a card from your hand to gain intimidate after winning a challenge he attacked in', function () {
        expect(this.player1).toAllowAbilityTrigger(this.viserion);

        this.player1.triggerAbility(this.viserion);
        this.player1.clickCard(this.aggo);

        expect(this.aggo.location).toBe('discard pile');
        expect(this.viserion.hasKeyword('Intimidate')).toBe(true);

        this.player2.clickCard(this.targaryenLoyalist);
        this.player1.clickCard(this.handmaiden);

        expect(this.handmaiden.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not gain intimidate if no card is discarded', function () {
        this.player1.clickPrompt('Pass');

        expect(this.viserion.hasKeyword('Intimidate')).toBe(false);
        expect(this.aggo.location).toBe('hand');

        this.player2.clickCard(this.targaryenLoyalist);
        expect(this.player1).isReadyToTakeAction();
    });
});
