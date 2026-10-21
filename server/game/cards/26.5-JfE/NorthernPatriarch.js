import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NorthernPatriarch extends DrawCard {
    // Northern Patriarch (26091)
    // Immune to opponents' Omen plot effects.
    // Interrupt: When the effects of an opponent's event would initiate, cancel those effects
    // unless that player moves 1 power from a card they control to Northern Patriarch. (Max once
    // per round.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.immuneTo(
                (card, abilityContext, context) =>
                    card.controller !== context.source.controller &&
                    card.getType() === 'plot' &&
                    card.hasTrait('Omen')
            )
        });
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.source.controller !== context.player && event.source.getType() === 'event'
            },
            message: {
                format: '{player} uses {source} to cancel {event} unless {opponent} moves 1 power from a card they control to {source}',
                args: {
                    event: (context) => context.event.source,
                    opponent: (context) => context.event.source.controller
                }
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => hasPowerToMove(context.event.source.controller),
                thenAction: GameActions.choose({
                    player: (context) => context.event.source.controller,
                    title: 'Move 1 power to prevent the cancel?',
                    choices: {
                        'Move 1 power': GameActions.chooseCards({
                            player: (context) => context.event.source.controller,
                            title: 'Select a card to move power from',
                            cardCondition: (card, context) =>
                                card.controller === context.event.source.controller &&
                                card.power > 0 &&
                                ['play area', 'faction', 'active plot'].includes(card.location),
                            gameAction: (card, context) =>
                                GameActions.movePower({
                                    from: card,
                                    to: context.source,
                                    amount: 1
                                })
                        }),
                        'Do not move power': GameActions.cancelEffects((context) => ({
                            event: context.event
                        }))
                    }
                }),
                elseAction: GameActions.cancelEffects((context) => ({ event: context.event }))
            }),
            max: ability.limit.perRound(1)
        });
    }
}

function hasPowerToMove(player) {
    return (
        player.faction.power > 0 ||
        (player.activePlot && player.activePlot.power > 0) ||
        player.getNumberOfCardsInPlay((card) => card.power > 0) > 0
    );
}

NorthernPatriarch.code = '26091';

export default NorthernPatriarch;
