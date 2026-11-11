import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SealOfTheHand extends DrawCard {
    // Seal of the Hand (01032)
    // Lord or Lady character only.
    // Action: Kneel Seal of the Hand to stand attached character.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: ['Lord', 'Lady'] });
        this.action({
            title: 'Stand attached character',
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to stand {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.standCard((context) => ({ card: context.source.parent }))
        });
    }
}

SealOfTheHand.code = '01032';

export default SealOfTheHand;
