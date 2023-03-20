const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class SerGilbertFarring extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move 1 power',
            limit: ability.limit.perPhase(1),
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select location to move power',
                cardCondition: { location: 'play area', type: 'location', controller: 'current' }
            },
            message: '{player} moves 1 power from {source} to {target} to give it immunity to assault until the end of the phase',
            handler: context => {
                this.game.resolveGameAction(GameActions.movePower(context => ({ from: this, to: context.target }))
                    .then({
                        gameAction: GameActions.genericHandler(context => {
                            this.untilEndOfPhase(ability => ({
                                match: context.target,
                                effect: ability.effects.cannotBeAssaulted()
                            }));
                        })
                    })
                , context);
            }
        });
    }
}

SerGilbertFarring.code = '24002';

module.exports = SerGilbertFarring;
