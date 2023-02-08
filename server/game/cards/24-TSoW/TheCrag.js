const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class TheCrag extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.controller === this.controller && card.name === 'Robb Stark',
            effect: [
                ability.effects.addKeyword('assault'),
                ability.effects.cannotBeSaved()
            ]
        });
        this.reaction({
            when: {
                onCardKneeled: event => event.card.getType() === 'location' && event.card.isUnique() && event.cause === 'assault'
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to have {source} gain {amount} power',
                args: { amount: () => this.getAmountOfPower() }
            },
            gameAction: GameActions.gainPower({ amount: this.getAmountOfPower(), card: this })
        });
    }

    getAmountOfPower() {
        this.controller.activePlot && this.controller.activePlot.hasTrait('War') ? 2 : 1;
    }
}

TheCrag.code = '24018';

module.exports = TheCrag;
