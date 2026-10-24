import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CageOfRavens extends DrawCard {
    // Cage of Ravens (15034)
    // Steward character only.
    // Action: Kneel Cage of Ravens to put a card with printed cost 1 or lower into play from your
    // hand.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Steward' });
        this.action({
            title: 'Put card into play',
            cost: ability.costs.kneelSelf(),
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.player &&
                    card.getPrintedCost() <= 1
            },
            message: '{player} kneels {source} to put {target} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

CageOfRavens.code = '15034';

export default CageOfRavens;
