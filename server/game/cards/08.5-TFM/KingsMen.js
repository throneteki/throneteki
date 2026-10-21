import DrawCard from '../../drawcard.js';

class KingsMen extends DrawCard {
    // King's Men (08087)
    // Reaction: After a phase begins, choose a kneeling character. Until the end of the phase,
    // treat that character as if its printed text box were blank (except for Traits). (Limit once
    // per round.)
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

export default KingsMen;
