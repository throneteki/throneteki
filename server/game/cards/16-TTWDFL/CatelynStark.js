import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CatelynStark extends DrawCard {
    // Catelyn Stark (16011)
    // Action: During an [intrigue] or [power] challenge in which you are the defending player, put
    // Catelyn Stark into play from your hand knelt, participating as a defender. At the end of the
    // phase, if Catelyn Stark is still in play, return her to your hand.
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
