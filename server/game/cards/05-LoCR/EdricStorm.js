import DrawCard from '../../drawcard.js';

class EdricStorm extends DrawCard {
    // Edric Storm (05025)
    // Reaction: After the dominance phase begins, choose a character. That character does not
    // contribute its STR to its controller's total for dominance this phase.
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'dominance'
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.doesNotContributeToDominance()
                }));

                this.game.addMessage(
                    "{0} uses {1} to exclude {2}'s strength from dominance this phase",
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

EdricStorm.code = '05025';

export default EdricStorm;
