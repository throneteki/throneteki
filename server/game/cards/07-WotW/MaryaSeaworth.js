import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaryaSeaworth extends DrawCard {
    // Marya Seaworth (07025)
    // Reaction: After a character is bypassed using stealth, pay 1 gold to kneel it. (Limit twice
    // per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBypassedByStealth: () => true
            },
            cost: ability.costs.payGold(1),
            limit: ability.limit.perPhase(2),
            message: {
                format: '{player} uses {source} and pays 1 gold to kneel {target}',
                args: { target: (context) => context.event.target }
            },
            gameAction: GameActions.kneelCard((context) => ({ card: context.event.target }))
        });
    }
}

MaryaSeaworth.code = '07025';

export default MaryaSeaworth;
