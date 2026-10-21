import DrawCard from '../../drawcard.js';

class TearsOfLys extends DrawCard {
    // Tears of Lys (01044)
    // Reaction: After you win an [intrigue] challenge as the attacking player, place a poison token
    // on a character without an [intrigue] icon controlled by the losing opponent. At the end of
    // the phase, if that character still has the poison token, remove it and kill that character.
    // (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event) =>
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'intrigue'
            },
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.game.currentChallenge.loser &&
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

TearsOfLys.code = '01044';

export default TearsOfLys;
