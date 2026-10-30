import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class INeverBetAgainstMyFamily extends DrawCard {
    // I Never Bet Against My Family (02050)
    // Challenges Action: Kneel your faction card to reveal the bottom 5 cards of your deck. You may
    // put 1 unique [lannister] character revealed by this effect into play; return the other cards
    // to the bottom of your deck in any order. At the end of the phase, if that card is still in
    // play, discard it from play (cannot be saved).
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character in play from bottom of your deck',
            phase: 'challenge',
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} plays {source} and kneels their faction card to reveal the bottom 5 cards of their deck',
            gameAction: GameActions.revealCards((context) => ({
                cards: context.player.drawDeck.slice(-5),
                player: context.player,
                whileRevealed: GameActions.chooseCards({
                    optional: true,
                    title: 'Select a character',
                    cardCondition: (card, context) =>
                        context.revealed.includes(card) &&
                        card.isMatch({ type: 'character', unique: true, faction: 'lannister' }),
                    gameAction: (card) => GameActions.putIntoPlay({ card })
                })
            })).then({
                message: {
                    format: '{player} places {cards} on the bottom of their deck',
                    args: { cards: (context) => othersInDeck(context) }
                },
                gameAction: GameActions.simultaneously((context) => [
                    ...othersInDeck(context).map((card) =>
                        GameActions.placeCard({
                            card,
                            location: 'draw deck',
                            bottom: true,
                            player: context.player,
                            orderable: true
                        })
                    ),
                    ...(context.parentContext.chosenCards || [])
                        .filter((card) => card.location === 'play area')
                        .map((card) =>
                            GameActions.delayedEffect(() => {
                                return {
                                    duration: 'untilTriggered',
                                    title: card.name,
                                    when: { onAtEndOfPhase: () => true },
                                    until: { onCardLeftPlay: (event) => event.card === card },
                                    gameAction: GameActions.ifCondition({
                                        condition: () =>
                                            ['play area', 'duplicate'].includes(card.location),
                                        thenAction: {
                                            message:
                                                '{player} resolves the delayed effect from {source}: {gameAction}',
                                            gameAction: GameActions.discardCard({
                                                card,
                                                allowSave: false
                                            })
                                        }
                                    })
                                };
                            })
                        )
                ])
            })
        });
    }
}

const othersInDeck = (context) =>
    context.parentContext.revealed.filter((card) => card.location === 'draw deck');

INeverBetAgainstMyFamily.code = '02050';

export default INeverBetAgainstMyFamily;
