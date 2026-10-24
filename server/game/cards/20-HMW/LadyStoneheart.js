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
            message:
                '{player} uses {source} to have each player kill a loyal or House Frey character they control',
            gameAction: GameActions.simultaneously((context) =>
                context.targets.selections
                    .filter((selection) => !!selection.value)
                    .map((selection) =>
                        GameActions.kill({
                            player: selection.choosingPlayer,
                            card: selection.value
                        })
                    )
            )
        });
        this.action({
            title: 'Put into play',
            phase: 'dominance',
            location: 'dead pile',
            condition: (context) => context.player.canPutIntoPlay(context.source),
            cost: ability.costs.choose({
                'Discard power': ability.costs.discardPower(
                    1,
                    (card) => card.getType() === 'character' && card.hasTrait('Brotherhood')
                ),
                'Discard kiss token': ability.costs.discardTokenFromCard(
                    Tokens.kiss,
                    1,
                    (card, context) =>
                        card.controller === context.player &&
                        card.hasToken(Tokens.kiss) &&
                        card.location === 'play area'
                )
            }),
            message: {
                format: '{player} discards 1 {token} from {costCard} to put {source} into play from their dead pile',
                args: {
                    token: (context) => (context.costs.discardPower ? 'power' : 'kiss token'),
                    costCard: (context) => context.costs.discardPower || context.costs.discardToken
                }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            }))
        });
    }
}

LadyStoneheart.code = '20041';

export default LadyStoneheart;
