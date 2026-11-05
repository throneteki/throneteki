import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ScoutingVessel extends DrawCard {
    // Scouting Vessel (12020)
    // Interrupt: When a character you control discards a card using pillage, kneel and sacrifice
    // Scouting Vessel to discard 3 cards instead.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTopCardsDiscarded: (event, context) =>
                    event.source.getType() === 'character' &&
                    event.source.controller === context.player &&
                    event.isPillage
            },
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            message:
                '{player} kneels and sacrifices {source} to discard 3 cards with pillage instead of 1',
            gameAction: GameActions.changeEventAmount((context) => ({
                event: context.event,
                amount: context.event.amount + 2
            }))
        });
    }
}

ScoutingVessel.code = '12020';

export default ScoutingVessel;
