const DrawCard = require('../../drawcard.js');

class TakeTheBlack extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of character',
            max: ability.limit.perRound(1),
            phase: 'dominance',
            target: {
                cardCondition: {
                    type: 'character',
                    unique: false,
                    printedCostOrLower: 6,
                    location: 'play area'
                }
            },
            message: '{player} plays {source} to take control of {target}',
            handler: (context) => {
                this.game.takeControl(context.player, context.target);
            }
        });
    }
}

TakeTheBlack.code = '01139';

module.exports = TakeTheBlack;
