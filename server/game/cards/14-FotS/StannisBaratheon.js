import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class StannisBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.immuneTo(
                (card) => card.controller !== this.controller && card.getType() === 'event'
            )
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.controller.canDraw() &&
                    event.challenge.isMatch({ winner: this.controller, challengeType: 'power' }) &&
                    event.challenge.attackingPlayer.getClaim() > 0
            },
            handler: (context) => {
                let claim = context.event.challenge.attackingPlayer.getClaim();
                let cards = context.player.drawCardsToHand(claim).length;
                this.game.addMessage(
                    '{0} uses {1} to draw {2}',
                    context.player,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

StannisBaratheon.code = '14002';

export default StannisBaratheon;
