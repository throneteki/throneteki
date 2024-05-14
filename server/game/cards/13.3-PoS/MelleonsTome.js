import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MalleonsTome extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addIcon('intrigue')
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.winner === this.controller &&
                    this.parent &&
                    this.parent.isAttacking()
            },
            handler: (context) => {
                let message = "{0} plays {1} to look at {2}'s hand";
                let messageArgs = [context.player, this, context.event.challenge.loser];

                this.game.resolveGameAction(
                    GameActions.lookAtHand({
                        player: context.player,
                        opponent: context.event.challenge.loser,
                        context
                    })
                );

                if (
                    (this.parent && this.parent.name === 'Eddard Stark') ||
                    this.parent.hasTrait('Maester')
                ) {
                    this.parent.controller.standCard(this.parent);
                    message += ' and stand {3}';
                    messageArgs.push(this.parent);
                }

                this.game.addMessage(message, ...messageArgs);
            },
            limit: ability.limit.perPhase(1)
        });
    }
}

MalleonsTome.code = '13042';

export default MalleonsTome;
