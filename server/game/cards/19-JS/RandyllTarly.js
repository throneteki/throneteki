import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RandyllTarly extends DrawCard {
    // Randyll Tarly (19015)
    // Renown.
    // Action: Kneel a The Reach location to, either: stand an Army character, or reveal the top
    // card of your deck. If it is a location, draw it (put it into play instead if it has the The
    // Reach trait). (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Army or reveal top card',
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(
                (card) => card.getType() === 'location' && card.hasTrait('The Reach')
            ),
            message:
                '{player} uses {source} and kneels {costs.kneel} to either stand an Army character, or reveal the top card of their deck',
            gameAction: GameActions.choose({
                choices: {
                    'Stand an Army': {
                        message: '{player} chooses to stand an Army character',
                        gameAction: GameActions.chooseCards({
                            title: 'Select an Army',
                            cardCondition: (card) =>
                                card.location === 'play area' &&
                                card.getType() === 'character' &&
                                card.hasTrait('Army') &&
                                card.kneeled,
                            gameAction: (card) => GameActions.standCard({ card })
                        })
                    },
                    'Reveal top card': {
                        message: '{player} chooses, and {gameAction}',
                        gameAction: GameActions.revealTopCards((context) => ({
                            player: context.player,
                            revealWithMessage: false
                        })).then({
                            condition: (context) =>
                                context.event.cards[0].isMatch({ type: 'location' }) &&
                                context.parentContext.revealed.length > 0,
                            message: '{player} {gameAction}',
                            gameAction: GameActions.ifCondition({
                                condition: (context) =>
                                    context.event.cards[0].isMatch({ trait: 'The Reach' }),
                                thenAction: GameActions.putIntoPlay((context) => ({
                                    card: context.parentContext.revealed[0]
                                })),
                                elseAction: GameActions.drawSpecific((context) => ({
                                    player: context.player,
                                    cards: context.parentContext.revealed
                                }))
                            })
                        })
                    }
                }
            })
        });
    }
}

RandyllTarly.code = '19015';

export default RandyllTarly;
