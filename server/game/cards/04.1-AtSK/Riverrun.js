import DrawCard from '../../drawcard.js';

class Riverrun extends DrawCard {
    // Riverrun (04003)
    // Reaction: After power is gained by or moved to a House Tully character, kneel Riverrun to
    // have that character gain 1 power.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event) => this.isTullyCharacter(event.card),
                onCardPowerMoved: (event) => this.isTullyCharacter(event.target)
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let tullyCharacter = context.event.card || context.event.target;
                tullyCharacter.modifyPower(1);

                this.game.addMessage(
                    '{0} kneels {1} to have {2} gain 1 power',
                    this.controller,
                    this,
                    tullyCharacter
                );
            }
        });
    }

    isTullyCharacter(card) {
        return card.getType() === 'character' && card.hasTrait('House Tully');
    }
}

Riverrun.code = '04003';

export default Riverrun;
