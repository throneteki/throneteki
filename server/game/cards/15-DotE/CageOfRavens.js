import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CageOfRavens extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Steward' });
        this.action({
            title: 'Put card into play',
            cost: ability.costs.kneelSelf(),
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    card.getPrintedCost() <= 1 &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to put {2} into play',
                    this.controller,
                    this,
                    context.target
                );
                this.game.resolveGameAction(
                    GameActions.putIntoPlay((context) => ({
                        player: context.player,
                        card: context.target
                    })),
                    context
                );
            }
        });
    }
}

CageOfRavens.code = '15034';

export default CageOfRavens;
