import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class StannisBaratheon extends DrawCard {
    // Stannis Baratheon (14002)
    // Immune to opponents' events.
    // Reaction: After you win a [power] challenge, draw X cards. X is the claim value on the
    // attacking player's revealed plot card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.immuneTo(
                (card, arg, context) =>
                    card.controller !== context.source.controller && card.getType() === 'event'
            )
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.controller.canDraw() &&
                    event.challenge.isMatch({
                        winner: context.source.controller,
                        challengeType: 'power'
                    }) &&
                    event.challenge.attackingPlayer.getClaim() > 0
            },
            message: {
                format: '{player} uses {source} to draw {cards}',
                args: {
                    cards: (context) =>
                        TextHelper.count(context.event.challenge.attackingPlayer.getClaim(), 'card')
                }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: context.event.challenge.attackingPlayer.getClaim()
            }))
        });
    }
}

StannisBaratheon.code = '14002';

export default StannisBaratheon;
