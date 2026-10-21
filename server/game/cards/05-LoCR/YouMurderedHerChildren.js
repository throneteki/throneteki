import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class YouMurderedHerChildren extends DrawCard {
    // You Murdered Her Children (05030)
    // Challenges Action: Choose a [martell] character you control. Until the end of the phase,
    // double that character's STR. At the end of the phase, if that character is still in play,
    // kill it.
    setupCardAbilities(ability) {
        this.action({
            title: 'Double character strength',
            phase: 'challenge',
            target: {
                activePromptTitle: 'Choose character',
                cardCondition: (card, context) =>
                    card.getType() === 'character' &&
                    card.isFaction('martell') &&
                    card.controller === context.source.controller
            },
            message: '{player} uses {source} to double the strength of {target}',
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.target,
                    effect: ability.effects.modifyStrengthMultiplier(2)
                })),
                GameActions.lastingEffect((context) => ({
                    duration: 'atEndOfPhase',
                    match: context.target,
                    condition: () => 'play area' === context.target.location,
                    effect: ability.effects.killIfStillInPlay(true)
                }))
            ])
        });
    }
}

YouMurderedHerChildren.code = '05030';

export default YouMurderedHerChildren;
