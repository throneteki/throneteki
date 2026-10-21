import DrawCard from '../../drawcard.js';

class FirstRanger extends DrawCard {
    // First Ranger (20022)
    // Unique character only.
    // Attached character gains a [military] icon and the Ranger trait.
    // Reaction: After you win a [military] challenge in which you control a participating Ranger
    // character, choose and kill a non-unique character with STR X or lower controlled by the
    // losing opponent. X is the number of Ranger characters you control. (Limit once per phase.)
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
