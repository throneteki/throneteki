import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerDavenLannister extends DrawCard {
    // Ser Daven Lannister (24007)
    // Renown.
    // Reaction: After Ser Daven Lannister gains 1 or more power, each opponent must choose and
    // discard 1 card from their hand. Then, if you have more cards in hand than each opponent, draw
    // 1 card. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event, context) =>
                    event.card === context.source
            },
            message:
                '{player} uses {source} to have each opponent choose and discard 1 card from their hand',
            limit: ability.limit.perRound(2),
            gameAction: GameActions.chooseCards({
                players: (context) => context.game.getOpponents(context.player),
                title: 'Select a card',
                cardCondition: (card, context) =>
                    card.controller === context.choosingPlayer && card.location === 'hand',
                gameAction: (card) => GameActions.discardCard({ card })
            }).then({
                condition: (context) =>
                    context.game
                        .getOpponents(context.player)
                        .every(
                            (opponent) => opponent.getHandCount() < context.player.getHandCount()
                        ),
                message: 'Then, {player} draws 1 card',
                gameAction: GameActions.drawCards((context) => ({
                    amount: 1,
                    player: context.player
                }))
            })
        });
    }
}

SerDavenLannister.code = '24007';

export default SerDavenLannister;
