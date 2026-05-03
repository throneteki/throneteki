import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StannisBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event) => this.isCharacter(event.card),
                onCardPowerMoved: (event) => this.isCharacter(event.target)
            },
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: (card) =>
                    card.isMatch({
                        location: 'play area',
                        type: 'character'
                    }) && GameActions.kneelCard({ card }).allow()
            },
            cost: ability.costs.kneel((card) => card.getType() === 'location' && !card.isLimited()),
            message: '{player} uses {source} and kneels {costs.kneel} to kneel {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.kneelCard((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }

    isCharacter(card) {
        return card.getType() === 'character' && card.controller === this.controller;
    }
}

StannisBaratheon.code = '00104';

export default StannisBaratheon;
