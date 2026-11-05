import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Riverrun extends DrawCard {
    // Riverrun (04003)
    // Reaction: After power is gained by or moved to a House Tully character, kneel Riverrun to
    // have that character gain 1 power.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event, context) => context.source.isTullyCharacter(event.card),
                onCardPowerMoved: (event, context) => context.source.isTullyCharacter(event.target)
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to have {tullyCharacter} gain 1 power',
                args: { tullyCharacter: (context) => context.event.card || context.event.target }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.event.card || context.event.target,
                amount: 1
            }))
        });
    }

    isTullyCharacter(card) {
        return card.getType() === 'character' && card.hasTrait('House Tully');
    }
}

Riverrun.code = '04003';

export default Riverrun;
