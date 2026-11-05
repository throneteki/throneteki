describe('Vengeance for Elia', function () {
    function setup(context, challengeType) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: ['Tywin Lannister (Core)'],
                hand: ['Hedge Knight'],
                power: 1
            },
            player2: {
                faction: 'martell',
                inPlay: ['Burned Men'],
                hand: ['Vengeance for Elia'],
                gold: 2,
                power: 1
            }
        });
        context.unopposedChallenge(context.player1, challengeType, context.tywinLannister);
        context.player2.triggerAbility('Vengeance for Elia');
    }

    it('has the attacker kill a character for military claim instead of you', function () {
        setup(this, 'Military');
        this.player1.clickCard(this.tywinLannister);
        expect(this.tywinLannister.location).toBe('dead pile');
        expect(this.burnedMen.location).toBe('play area');
    });

    it('has the attacker discard from their hand for intrigue claim instead of you', function () {
        setup(this, 'Intrigue');
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.player2Object.hand).toEqual([]);
    });

    it('has the attacker move power from themselves to themselves for power claim', function () {
        setup(this, 'Power');
        expect(this.player1Object.getTotalPower()).toBe(3);
        expect(this.player2Object.getTotalPower()).toBe(1);
    });
});
