import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Viserion extends DrawCard {
    // Viserion (13013)
    // Ambush (5). No attachments.
    // Reaction: After you win a challenge in which Viserion is attacking, discard 1 card from your
    // hand to have Viserion gain intimidate until the end of the challenge.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isAttacking()
            },
            cost: [ability.costs.discardFromHand()],
            message: {
                format: '{player} discards {discardCost} to have {source} gain intimidate until the end of the challenge',
                args: {
                    discardCost: (context) => context.costs.discardFromHand
                }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.this,
                effect: [ability.effects.addKeyword('Intimidate')]
            }))
        });
    }
}

Viserion.code = '13013';

export default Viserion;
