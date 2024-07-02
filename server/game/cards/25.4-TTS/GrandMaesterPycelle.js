import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class GrandMaesterPycelle extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardDiscarded: (event) => event.originalLocation === 'hand'
            },
            limit: ability.limit.perRound(2),
            message: {
                format: "{player} uses {source} to place a discarded card facedown under {controller}'s agenda instead of placing it in their discard pile",
                args: { controller: (context) => context.event.card.controller }
            },
            gameAction: GameActions.placeCardUnderneath((context) => ({
                card: context.event.card,
                parentCard: context.event.card.controller.agenda,
                facedown: true
            }))
        });
    }
}

GrandMaesterPycelle.code = '25065';

export default GrandMaesterPycelle;
