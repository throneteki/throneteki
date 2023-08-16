const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class TheWardenOfTheWest extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'lannister', trait: 'Lord' });

        this.whileAttached({
            effect: [
                ability.effects.addTrait('Commander'),
                ability.effects.modifyStrength(1)
            ]
        });

        this.reaction({
            when: {
                onCardStrengthChanged: event => this.parent && event.card === this.parent && event.amount > 0 && event.applying
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to stand {parent}',
                args: { parent: () => this.parent }
            },
            gameAction: GameActions.standCard({ card: this.parent })
        });
    }
}

TheWardenOfTheWest.code = '25594';

module.exports = TheWardenOfTheWest;
