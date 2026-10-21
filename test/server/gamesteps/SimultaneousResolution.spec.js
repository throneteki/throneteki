import AbilityContext from '../../../server/game/AbilityContext.js';
import DelayedEffect from '../../../server/game/DelayedEffect.js';
import GameActions from '../../../server/game/GameActions/index.js';

describe('priority of simultaneous resolution', function () {
    describe('delayed effects that resolve at the same time', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                firstPlayer: 'player2',
                player1: { inPlay: ['House Maester'] },
                player2: { gold: 5, inPlay: ['Braided Warrior'], hand: ['Hedge Knight'] }
            });

            this.order = [];
            for (const [player, source] of [
                [this.player1Object, this.houseMaester],
                [this.player2Object, this.braidedWarrior]
            ]) {
                this.game.addDelayedEffect(
                    new DelayedEffect({
                        context: new AbilityContext({ game: this.game, player, source }),
                        when: { onCardEntersPlay: (event) => event.card === this.hedgeKnight },
                        gameAction: GameActions.genericHandler(() => this.order.push(source.name))
                    })
                );
            }

            this.player2.clickCard(this.hedgeKnight);
        });

        it('resolve in the order the first player chooses, whoever controls them', function () {
            expect(this.player2).toHavePrompt('Choose which effect resolves next');
            expect(this.player1).toHavePrompt(
                'Waiting for first player to choose the order of effects'
            );

            this.player2.clickPrompt('player1 - House Maester');

            expect(this.order).toEqual(['House Maester', 'Braided Warrior']);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('state checks that apply at the same time', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'setup',
                player1: {
                    faction: 'targaryen',
                    hand: ['Oathsworn Wildling', 'Arstan Whitebeard', 'Ser Barristan Selmy (LoCR)']
                }
            });

            this.player1.clickCard(this.oathswornWildling);
            this.player1.clickCard(this.arstanWhitebeard);
            this.player1.clickCard(this.serBarristanSelmy);
            this.completeSetup();
        });

        it('resolve in the order the first player chooses', function () {
            const firstPlayer =
                this.game.getFirstPlayer() === this.player1Object ? this.player1 : this.player2;

            expect(firstPlayer).toHavePrompt('Choose which effect resolves next');

            firstPlayer.clickPrompt('player1 - Arstan Whitebeard');

            expect(this.arstanWhitebeard.location).toBe('discard pile');
            expect(this.oathswornWildling.location).toBe('discard pile');
            const log = this.game.getPlainTextLog();
            expect(log.indexOf('sacrifices Arstan Whitebeard')).toBeLessThan(
                log.indexOf('sacrifices Oathsworn Wildling')
            );
        });
    });
});
