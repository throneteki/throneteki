import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CatelynStark extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Add as a defender',
            location: 'hand',
            condition: () =>
                this.game.isDuringChallenge({
                    challengeType: ['intrigue', 'power'],
                    defendingPlayer: this.controller
                }) && this.controller.canPutIntoPlay(this),
            message: '{player} puts {source} into play as a defender',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: this,
                kneeled: true
            })).thenExecute(() => {
                this.game.currentChallenge.addDefender(this);
                this.atEndOfPhase((ability) => ({
                    match: this,
                    condition: () => 'play area' === this.location,
                    effect: ability.effects.returnToHandIfStillInPlay(true)
                }));
            })
        });
    }
}

CatelynStark.code = '16011';

export default CatelynStark;
