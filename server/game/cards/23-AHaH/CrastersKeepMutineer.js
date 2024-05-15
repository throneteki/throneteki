import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CrastersKeepMutineer extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                activePromptTitle: 'Select a duplicate',
                cardCondition: (card) =>
                    card.location === 'duplicate' && card.parent.getType() === 'character'
            },
            message: {
                format: '{player} uses {source} to discard a duplicate on {duplicateParent}',
                args: { duplicateParent: (context) => context.target.parent }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.discardCard({ card: context.target }),
                    context
                );
            }
        });
    }
}

CrastersKeepMutineer.code = '23009';

export default CrastersKeepMutineer;
