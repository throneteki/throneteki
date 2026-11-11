import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class ReznakMoReznak extends DrawCard {
    // Reznak mo Reznak (18013)
    // Bestow (3).
    // Reaction: After a character is discarded from your hand, Reznak mo Reznak gains 1 gold. Then,
    // you may discard X gold from him to put that character into play from your discard pile, where
    // X is that character's printed cost. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.reaction({
            limit: ability.limit.perRound(2),
            when: {
                onCardDiscarded: (event, context) =>
                    event.card.controller === context.player &&
                    event.originalLocation === 'hand' &&
                    event.card.getType() === 'character'
            },
            message: '{player} uses {source} to have {source} gain 1 gold',
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.gold,
                amount: 1
            })).then({
                condition: (context) => {
                    const card = context.parentContext.event.card;
                    return (
                        card.location === 'discard pile' &&
                        context.source.tokens[Tokens.gold] >= printedCost(card) &&
                        context.player.canPutIntoPlay(card)
                    );
                },
                gameAction: GameActions.may({
                    title: (context) => `Put ${context.parentContext.event.card.name} into play?`,
                    message: {
                        format: 'Then {player} discards {amount} gold from {source} to put {character} into play',
                        args: {
                            amount: (context) => printedCost(context.parentContext.event.card),
                            character: (context) => context.parentContext.event.card
                        }
                    },
                    gameAction: GameActions.simultaneously([
                        GameActions.discardToken((context) => ({
                            card: context.source,
                            token: Tokens.gold,
                            amount: printedCost(context.parentContext.event.card)
                        })),
                        GameActions.putIntoPlay((context) => ({
                            player: context.player,
                            card: context.parentContext.event.card
                        }))
                    ])
                })
            })
        });
    }
}

function printedCost(card) {
    return card.translateXValue(card.getPrintedCost());
}

ReznakMoReznak.code = '18013';

export default ReznakMoReznak;
