const DrawCard = require('../../drawcard.js');

class KingsMen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            limit: ability.limit.perRound(1),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character' && card.kneeled
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.blankExcludingTraits
                }));

                this.game.addMessage(
                    '{0} uses {1} to treat the text box of {2} as blank until the end of the phase',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

KingsMen.code = '08087';

module.exports = KingsMen;
