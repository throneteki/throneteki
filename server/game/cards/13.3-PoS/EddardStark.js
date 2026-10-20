import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import Conditions from '../../Conditions.js';

class EddardStark extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kill a character',
            phase: 'dominance',
            condition: (context) => Conditions.allCharactersAreStark({ player: context.player }),
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 4
            },
            message: '{player} kneels {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target })),
            limit: ability.limit.perPhase(1)
        });
    }
}

EddardStark.code = '13041';

export default EddardStark;
