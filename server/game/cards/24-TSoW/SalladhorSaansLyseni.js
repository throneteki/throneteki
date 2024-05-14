import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SalladhorSaansLyseni extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isAttacking()
            },
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} to have {source} gain {amount} power',
                args: { amount: (context) => this.getAmount(context) }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: this,
                amount: this.getAmount(context)
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
