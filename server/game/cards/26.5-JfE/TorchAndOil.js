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
                format: '{player} kneels {costs.kneel} to reveal a {action} by {opponent}',
                args: {
                    action: (context) =>
                        context.event.name === 'onCardDrawn'
                            ? 'card drawn'
                            : 'card marshaled into shadows',
                    opponent: (context) => context.event.player
                }
            },
            gameAction: GameActions.revealCards((context) => ({
                cards: [context.event.card],
                player: context.event.player
            })).then({
                message: '{player} {gameAction}',
                gameAction: GameActions.ifCondition({
                    condition: (context) =>
                        context.event.cards[0].isMatch({ type: 'character' }) &&
                        context.event.revealed.length > 0,
                    thenAction: GameActions.may({
                        title: `Sacrifice to discard and stand?`,
                        message: '{player} {gameAction}',
                        gameAction: GameActions.sacrificeCard({ card: this }).then({
                            gameAction: GameActions.simultaneously([
                                GameActions.discardCard((context) => ({
                                    card: context.event.revealed[0]
                                })),
                                GameActions.standCard(() => ({
                                    card: this.parent
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
