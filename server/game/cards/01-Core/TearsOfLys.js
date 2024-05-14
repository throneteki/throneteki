const DrawCard = require('../../drawcard.js');

class TearsOfLys extends DrawCard {
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

module.exports = TearsOfLys;
