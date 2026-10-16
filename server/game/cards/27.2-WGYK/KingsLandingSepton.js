import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KingsLandingSepton extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.source.controller !== this.controller &&
                    event.ability.isTriggeredAbility() &&
                    ['character', 'location', 'attachment'].includes(event.source.getType())
            },
            cost: ability.costs.returnSelfToHand(),
            message: {
                format: "{player} uses {source} and returns {source} to their hand to cancel {character}'s ability",
                args: { character: (context) => context.event.source }
            },
            gameAction: GameActions.genericHandler((context) => {
                context.event.cancel();
            })
        });
    }
}

KingsLandingSepton.code = '27025';

export default KingsLandingSepton;
