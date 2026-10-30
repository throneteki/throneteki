import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SeaBitch extends DrawCard {
    // Sea Bitch (04112)
    // Action: Sacrifice Sea Bitch to choose a non-limited location. Take control of that location
    // until the end of the phase.
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of location',
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) => context.source.cardCondition(card, context)
            },
            message:
                '{player} sacrifices {source} to take control of {target} until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.takeControl(context.player)
            }))
        });
    }

    cardCondition(card, context) {
        return (
            card.getType() === 'location' &&
            card.location === 'play area' &&
            !card.hasKeyword('Limited') &&
            card.name !== this.name &&
            context.player.canControl(card)
        );
    }
}

SeaBitch.code = '04112';

export default SeaBitch;
