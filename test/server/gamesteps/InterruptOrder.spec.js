import GameActions from '../../../server/game/GameActions/index.js';
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
            gameAction: GameActions.genericHandler(
                () => this.order.push('interrupt'),
                () => true
            )
        });
        this.houseMaester.forcedInterrupt({
            when,
            gameAction: GameActions.genericHandler(
                () => this.order.push('forced'),
                () => true
            )
        });
        this.houseMaester.interrupt({
            would: true,
            when,
            gameAction: GameActions.genericHandler(
                () => this.order.push('would'),
                () => true
            )
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
