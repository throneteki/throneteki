import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WaterDancersSword extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ printedStrengthOrLower: 3 });
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
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

WaterDancersSword.code = '15043';

export default WaterDancersSword;
