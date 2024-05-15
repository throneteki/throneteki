import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SpidersWhisperer extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                cardCondition: { location: 'play area', trait: 'Ally' }
            },
            message: '{player} is forced by {source} to discard {target} from play',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.discardCard((context) => ({
                        card: context.target
                    })),
                    context
                );
            }
        });
    }
}

SpidersWhisperer.code = '16005';

export default SpidersWhisperer;
