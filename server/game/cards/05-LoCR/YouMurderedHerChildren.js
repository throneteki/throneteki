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
                GameActions.delayedEffect((context) => {
                    const card = context.target;
                    return {
                        duration: 'untilTriggered',
                        title: card.name,
                        when: { onAtEndOfPhase: () => true },
                        until: { onCardLeftPlay: (event) => event.card === card },
                        gameAction: GameActions.ifCondition({
                            condition: () => ['play area', 'duplicate'].includes(card.location),
                            thenAction: {
                                message:
                                    '{player} resolves the delayed effect from {source}: {gameAction}',
                                gameAction: GameActions.kill({ card, allowSave: true })
                            }
                        })
                    };
                })
            ])
        });
    }
}

YouMurderedHerChildren.code = '05030';

export default YouMurderedHerChildren;
