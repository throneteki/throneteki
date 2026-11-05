import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import Conditions from '../../Conditions.js';

class EddardStark extends DrawCard {
    // Eddard Stark (13041)
    // Renown.
    // Dominance Action: If each character you control has the [stark] affiliation, kneel Eddard
    // Stark to choose and kill a character with printed cost 4 or lower. (Limit once per phase.)
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
