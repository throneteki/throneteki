import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KingsLandingSepton extends DrawCard {
    // King's Landing Septon (27025)
    // Interrupt: When the effects of an opponent's triggered character, location, or attachment
    // ability would initiate, return King's Landing Septon to your hand to cancel those effects.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.source.controller !== context.player &&
                    event.ability.isTriggeredAbility() &&
                    ['character', 'location', 'attachment'].includes(event.source.getType())
            },
            cost: ability.costs.returnSelfToHand(),
            message: {
                format: "{player} uses {source} and returns {source} to their hand to cancel {character}'s ability",
                args: { character: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

KingsLandingSepton.code = '27025';

export default KingsLandingSepton;
