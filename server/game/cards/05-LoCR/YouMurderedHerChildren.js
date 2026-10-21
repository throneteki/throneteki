import DrawCard from '../../drawcard.js';

class YouMurderedHerChildren extends DrawCard {
    // You Murdered Her Children (05030)
    // Challenges Action: Choose a [martell] character you control. Until the end of the phase,
    // double that character's STR. At the end of the phase, if that character is still in play,
    // kill it.
    setupCardAbilities() {
        this.action({
            title: 'Double character strength',
            phase: 'challenge',
            target: {
                activePromptTitle: 'Choose character',
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.isFaction('martell') &&
                    card.controller === this.controller
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrengthMultiplier(2)
                }));
                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => 'play area' === context.target.location,
                    effect: ability.effects.killIfStillInPlay(true)
                }));
                this.game.addMessage(
                    '{0} uses {1} to double the strength of {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

YouMurderedHerChildren.code = '05030';

export default YouMurderedHerChildren;
