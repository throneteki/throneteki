import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SalladhorSaansLyseni extends DrawCard {
    // Salladhor Saan's Lyseni (24001)
    // Assault. No attachments.
    // Reaction: After you win a challenge in which Salladhor Saan's Lyseni is attacking, it gains 1
    // power for every 2 kneeling locations the defending player controls. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isAttacking()
            },
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} to have {source} gain {amount} power',
                args: { amount: (context) => context.source.getAmount(context) }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.source,
                amount: context.source.getAmount(context)
            }))
        });
    }

    getAmount(context) {
        let numCards = context.event.challenge.loser.getNumberOfCardsInPlay({
            type: 'location',
            location: 'play area',
            kneeled: true
        });
        return Math.floor(numCards / 2);
    }
}

SalladhorSaansLyseni.code = '24001';

export default SalladhorSaansLyseni;
