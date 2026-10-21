import DrawCard from '../../drawcard.js';

class PoisonedCoin extends DrawCard {
    // Poisoned Coin (11078)
    // Shadow (0).
    // Reaction: After you win an unopposed challenge in which you control an attacking character
    // with shadow, place a poison token on a character without shadow controlled by the losing
    // opponent. At the end of the phase, if that character still has that poison token, remove it
    // and kill that character. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event) =>
                    this.controller === event.challenge.winner &&
                    event.challenge.isUnopposed() &&
                    event.challenge.attackers.some((card) => card.isShadow() && card.isAttacking())
            },
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.game.currentChallenge.loser &&
                    card.getType() === 'character' &&
                    !card.isShadow()
            },
            handler: (context) => {
                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.poison
                }));
            }
        });
    }
}

PoisonedCoin.code = '11078';

export default PoisonedCoin;
