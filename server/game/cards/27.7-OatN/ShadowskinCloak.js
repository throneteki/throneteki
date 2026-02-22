import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowskinCloak extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('stealth')
        });
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            message: '{player} is forced to return {source} to their hand',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToHand((context) => ({ card: context.source })),
                    context
                );
            }
        });
    }
}

ShadowskinCloak.code = '27603';
ShadowskinCloak.version = '1.0.1';

export default ShadowskinCloak;
