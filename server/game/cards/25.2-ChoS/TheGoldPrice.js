import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class TheGoldPrice extends AgendaCard {
    // The Gold Price (25040)
    // Locations you control enter play knelt.
    // Reaction: After a character is discarded at random from an opponent's hand, put it into play
    // under your control. At the end of the phase, if that card is still in play, sacrifice it
    // unless you pay X gold. X is that card's printed cost. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'any',
            match: (card) => card.getType() === 'location',
            effect: ability.effects.entersPlayKneeled()
        });
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.card.getType() === 'character' &&
                    event.card.owner !== context.player &&
                    event.originalLocation === 'hand' &&
                    event.isRandom
            },
            message: {
                format: '{player} uses {source} to put {card} into play under their control',
                args: { card: (context) => context.event.card }
            },
            limit: ability.limit.perPhase(1),
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.event.card
            })).then({
                gameAction: GameActions.delayedEffect({
                    duration: 'untilEndOfRound',
                    when: {
                        onAtEndOfPhase: (event, context) =>
                            ['play area', 'duplicate'].includes(chosenCard(context).location)
                    },
                    gameAction: GameActions.choose({
                        title: (context) => `Keep ${chosenCard(context).name}?`,
                        cancelable: false,
                        choices: {
                            'Pay gold': {
                                message: {
                                    format: '{player} pays {amount} gold to keep {card} for {source}',
                                    args: {
                                        amount: (context) => printedCost(context),
                                        card: (context) => chosenCard(context)
                                    }
                                },
                                gameAction: GameActions.payGold((context) => ({
                                    player: context.player,
                                    amount: printedCost(context)
                                }))
                            },
                            Sacrifice: {
                                message: {
                                    format: '{player} sacrifices {card} for {source}',
                                    args: { card: (context) => chosenCard(context) }
                                },
                                gameAction: GameActions.sacrificeCard((context) => ({
                                    card: chosenCard(context)
                                }))
                            }
                        }
                    })
                })
            })
        });
    }
}

function chosenCard(context) {
    return context.parentContext.event.card;
}

function printedCost(context) {
    const card = chosenCard(context);
    return card.translateXValue(card.getPrintedCost());
}

TheGoldPrice.code = '25040';

export default TheGoldPrice;
