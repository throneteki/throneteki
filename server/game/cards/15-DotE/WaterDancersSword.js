import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WaterDancersSword extends DrawCard {
    // Water Dancer's Sword (15043)
    // Character with printed STR 3 or lower only. Ambush (1).
    // Attached character gets +2 STR.
    // Forced Interrupt: When the challenges phase ends, return Water Dancer's Sword to hand.
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
