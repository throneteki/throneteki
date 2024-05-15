import DrawCard from '../../drawcard.js';
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
                    card.getPrintedCost() <= 4,
                gameAction: 'kill'
            },
            message: '{player} kneels {source} to kill {target}',
            handler: (context) => {
                this.game.killCharacter(context.target);
            },
            limit: ability.limit.perPhase(1)
        });
    }
}

EddardStark.code = '13041';

export default EddardStark;
