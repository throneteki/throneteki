import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Nymeria extends DrawCard {
    // Nymeria (03019)
    // Unique [stark] character only.
    // Attached character gains intimidate.
    // Action: Pay 1 gold to attach Nymeria to a different character. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark', unique: true });
        this.whileAttached({
            effect: ability.effects.addKeyword('Intimidate')
        });
        this.action({
            title: 'Attach Nymeria to another character',
            cost: ability.costs.payGold(1),
            target: {
                type: 'select',
                cardCondition: { location: 'play area', type: 'character' }
            },
            limit: ability.limit.perPhase(1),
            message: '{player} pays 1 gold to attach {source} to {target}',
            gameAction: GameActions.attach((context) => ({
                attachment: context.source,
                target: context.target
            }))
        });
    }
}

Nymeria.code = '03019';

export default Nymeria;
