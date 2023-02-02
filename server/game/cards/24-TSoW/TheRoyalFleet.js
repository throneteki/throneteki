const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class TheRoyalFleet extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onBypassedByStealth: () => true
            },
            gameAction: GameActions.ifCondition({
                condition: context => context.event.target.isLoyal(),
                thenAction: {
                    message: '{player} uses {source} to draw 1 card',
                    gameAction: GameActions.drawCards(context => ({ player: context.player, source: this }))
                },
                elseAction: {
                    message: '{player} uses {source} to have {source} gain 1 power',
                    gameAction: GameActions.gainPower({ card: this })
                }
            })
        });
    }
}

TheRoyalFleet.code = '24001';

module.exports = TheRoyalFleet;
