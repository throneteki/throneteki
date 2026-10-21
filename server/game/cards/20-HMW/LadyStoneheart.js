import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class LadyStoneheart extends DrawCard {
    // Lady Stoneheart (20041)
    // Intimidate.
    // Forced Interrupt: When the challenges phase ends, each player must choose and kill a loyal or
    // House Frey character they control, if able.
    // Dominance Action: Discard 1 kiss token from a character or 1 power from a Brotherhood
    // character to put Lady Stoneheart into play from your dead pile.
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character' &&
                    card.canBeKilled() &&
                    (card.isLoyal() || card.hasTrait('House Frey'))
            },
            handler: (context) => {
                let selections = context.targets.selections.filter(
                    (selection) => !!selection.value
                );
                for (const selection of selections) {
                    this.game.addMessage(
                        '{0} kills {1} for {2}',
                        selection.choosingPlayer,
                        selection.value,
                        this
                    );
                }
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        selections.map((selection) =>
                            GameActions.kill(
                                { player: selection.choosingPlayer, card: selection.value },
                                { allowSave: true }
                            )
                        )
                    )
                );
            }
        });

        this.action({
            title: 'Put into play',
            phase: 'dominance',
            location: 'dead pile',
            condition: () => this.controller.canPutIntoPlay(this),
            cost: ability.costs.choose({
                'Discard power': ability.costs.discardPower(
                    1,
                    (card) => card.getType() === 'character' && card.hasTrait('Brotherhood')
                ),
                'Discard kiss token': ability.costs.discardTokenFromCard(
                    Tokens.kiss,
                    1,
                    (card) =>
                        card.controller === this.controller &&
                        card.hasToken(Tokens.kiss) &&
                        card.location === 'play area'
                )
            }),
            handler: (context) => {
                context.player.putIntoPlay(this);
                if (context.costs.discardPower) {
                    this.game.addMessage(
                        '{0} discards 1 power from {1} to put {2} into play from their dead pile',
                        context.player,
                        context.costs.discardPower,
                        this
                    );
                } else {
                    this.game.addMessage(
                        '{0} discards 1 kiss token from {1} to put {2} into play from their dead pile',
                        context.player,
                        context.costs.discardToken,
                        this
                    );
                }
            }
        });
    }
}

LadyStoneheart.code = '20041';

export default LadyStoneheart;
