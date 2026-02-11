import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TorchAndOil extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDrawn: (event) => event.player !== this.controller,
                onCardPutIntoShadows: (event) =>
                    event.player !== this.controller && event.reason === 'marshal'
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to reveal a {action} by {controller}',
                args: {
                    action: (context) =>
                        context.event.name === 'onCardDrawn'
                            ? 'card drawn'
                            : 'card marshaled into shadows',
                    controller: (context) => context.event.card.controller
                }
            },
            gameAction: GameActions.revealCards((context) => ({
                cards: [context.event.card],
                player: context.event.player
            })).then({
                gameAction: GameActions.ifCondition({
                    condition: (context) =>
                        context.event.cards[0].isMatch({ type: 'character' }) &&
                        context.parentContext.revealed.length > 0,
                    thenAction: GameActions.may({
                        title: `Sacrifice to discard and stand?`,
                        message: {
                            format: '{player} chooses to sacrifice {source} to discard {card} and stand {parent}',
                            args: {
                                card: (context) => context.parentContext.revealed[0],
                                parent: (context) => context.cardStateWhenInitiated.parent
                            }
                        },
                        gameAction: GameActions.sacrificeCard({ card: this }).then({
                            gameAction: GameActions.simultaneously([
                                GameActions.discardCard((context) => ({
                                    card: context.parentcontext.parentContext.revealed[0]
                                })),
                                GameActions.standCard((context) => ({
                                    card: context.parentContext.cardStateWhenInitiated.parent
                                }))
                            ])
                        })
                    })
                })
            })
        });
    }
}

TorchAndOil.code = '26090';

export default TorchAndOil;
