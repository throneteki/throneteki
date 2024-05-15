import DrawCard from '../../drawcard.js';

class FirstRanger extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true });
        this.whileAttached({
            effect: [ability.effects.addIcon('military'), ability.effects.addTrait('Ranger')]
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'military' &&
                    this.isRangerParticipatingInChallenge()
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.game.currentChallenge.loser &&
                    card.getType() === 'character' &&
                    !card.isUnique() &&
                    card.getStrength() <= this.getNumberOfRangers(),
                gameAction: 'kill'
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to kill {target}',
            handler: (context) => {
                context.target.controller.killCharacter(context.target);
            }
        });
    }

    isRangerParticipatingInChallenge() {
        return this.controller.anyCardsInPlay(
            (card) => card.isParticipating() && card.hasTrait('Ranger')
        );
    }

    getNumberOfRangers() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait('Ranger')
        );
    }
}

FirstRanger.code = '20022';

export default FirstRanger;
