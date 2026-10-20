describe('interrupt order', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: ['Hedge Knight', 'House Maester'] },
            player2: { inPlay: ['Braided Warrior'] }
        });

        this.order = [];
        const when = { onCharacterKilled: (event) => event.card === this.hedgeKnight };
        this.houseMaester.interrupt({
            when,
            handler: () => this.order.push('interrupt')
        });
        this.houseMaester.forcedInterrupt({
            when,
            handler: () => this.order.push('forced')
        });
        this.houseMaester.interrupt({
            would: true,
            when,
            handler: () => this.order.push('would')
        });
        for (const ability of this.houseMaester.abilities.reactions.slice(-3)) {
            ability.registerEvents();
        }

        this.unopposedChallenge(this.player2, 'Military', this.braidedWarrior);
        this.player1.clickCard(this.hedgeKnight);
    });

    it('offers "would" interrupts before forced interrupts, and other interrupts after them', function () {
        this.player1.triggerAbility(this.houseMaester);

        expect(this.order).toEqual(['would', 'forced']);

        this.player1.triggerAbility(this.houseMaester);

        expect(this.order).toEqual(['would', 'forced', 'interrupt']);
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
