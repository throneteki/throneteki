import DrawCard from '../../drawcard.js';

class TyeneSand extends DrawCard {
    // Tyene Sand (02115)
    // Reaction: After you win an [intrigue] challenge in which Tyene Sand is participating as an
    // attacker, place a poison token on a character without an [intrigue] icon. At the end of the
    // phase, if that character still has the poison token, remove it and kill that character.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === this.controller &&
                    this.isAttacking()
            },
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.hasIcon('intrigue')
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

TyeneSand.code = '02115';

export default TyeneSand;
