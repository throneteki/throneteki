import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class CastleBlack extends DrawCard {
    // Castle Black (22014)
    // Reaction: After a challenge is initiated against you, choose and stand a [thenightswatch]
    // character or Castle Black. (Limit once per phase.)
    // Interrupt: When the effects of an opponent's triggered location ability would initiate, kneel
    // Castle Black to cancel those effects.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.initiatedAgainstPlayer === context.source.controller
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    (card.name === 'Castle Black' ||
                        (card.isFaction('thenightswatch') && card.getType() === 'character')) &&
                    card.kneeled,
                gameAction: 'stand'
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.ability.isTriggeredAbility() &&
                    event.source.getType() === 'location' &&
                    event.player !== context.source.controller
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to cancel {eventSource}',
                args: { eventSource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

CastleBlack.code = '22014';

export default CastleBlack;
