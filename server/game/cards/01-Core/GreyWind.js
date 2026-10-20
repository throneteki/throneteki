import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GreyWind extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel Grey Wind to kill a character',
            cost: ability.costs.kneelSelf(),
            phase: 'challenge',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() <= this.maxStrength(context.player)
            },
            message: '{player} kneels {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }

    maxStrength(player) {
        return player.anyCardsInPlay((card) => card.name === 'Robb Stark') ? 2 : 1;
    }
}

GreyWind.code = '01145';

export default GreyWind;
