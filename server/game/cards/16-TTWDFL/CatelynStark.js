const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class CatelynStark extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Add as a defender',
            location: 'hand',
            condition: () => (
                this.game.isDuringChallenge({ challengeType: ['intrigue', 'power'], defendingPlayer: this.controller }) &&
                this.controller.canPutIntoPlay(this)
            ),
            message: '{player} puts {source} into play as a defender',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay(context => ({
                        player: context.player,
                        card: this,
                        kneeled: true
                    })),
                    context
                );
                this.game.currentChallenge.addDefender(this);
                this.atEndOfPhase(ability => ({
                    match: this,
                    effect: ability.effects.returnToHandIfStillInPlay(true)
                }));
            }
        });
    }
}

CatelynStark.code = '16011';

module.exports = CatelynStark;
