const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

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

module.exports = WaterDancersSword;
