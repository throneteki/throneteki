import DrawCard from '../../drawcard.js';

class PutToTheSword extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.strengthDifference >= 5
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.game.currentChallenge.loser &&
                    card.getType() === 'character',
                gameAction: 'kill'
            },
            handler: (context) => {
                this.game.killCharacter(context.target);
                this.game.addMessage(
                    '{0} plays {1} to kill {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

PutToTheSword.code = '01041';

export default PutToTheSword;
