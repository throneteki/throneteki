import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Qyburn extends DrawCard {
    // Qyburn (08109)
    // Reaction: After a character is killed, kneel Qyburn to draw 2 cards. Then, choose and discard
    // 1 card from your hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: () => true
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to draw 2 cards',
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: 2
            })).then({
                gameAction: GameActions.chooseCards({
                    cardCondition: (card, context) =>
                        card.controller === context.player && card.location === 'hand',
                    gameAction: (card) => GameActions.discardCard({ card })
                })
            })
        });
    }
}

Qyburn.code = '08109';

export default Qyburn;
