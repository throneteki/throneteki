describe('Great Wyk', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Great Wyk', 'Hedge Knight'],
                deadPile: ['Drowned God Fanatic (SoKL)'],
                faction: 'greyjoy'
            },
            player2: { hand: ['Castle Guard', 'Winterfell Steward'] }
        });
        this.player1.clickCard(this.drownedGodFanatic);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.triggerAbility('Great Wyk');
        this.player2.clickCard(this.castleGuard);
    });

    it('has each opponent choose and discard 1 card from their hand', function () {
        expect(this.drownedGodFanatic.location).toBe('play area');
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('hand');
    });
});
