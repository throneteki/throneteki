import DrawCard from '../../drawcard.js';

class BeaconOfTheSouth extends DrawCard {
    setupCardAbilities() {
        this.attachmentRestriction({ faction: 'tyrell' });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    event.challenge.isAttacking(this.parent) &&
                    this.parent.allowGameAction('gainPower')
            },
            handler: (context) => {
                this.parent.modifyPower(1);
                this.game.addMessage(
                    '{0} uses {1} to gain 1 power on {2}',
                    context.player,
                    this,
                    this.parent
                );
            }
        });
    }
}

BeaconOfTheSouth.code = '10038';

export default BeaconOfTheSouth;
