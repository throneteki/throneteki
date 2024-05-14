const DrawCard = require('../../drawcard');
const { ChallengeTracker } = require('../../EventTrackers');

class FirstInBattle extends DrawCard {
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.action({
            phase: 'challenge',
            condition: () => this.getNumberOfReach() >= 3,
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    condition: () => this.isAttackingInFirstChallenge(),
                    match: (card) =>
                        card.getType() === 'character' &&
                        (card.hasTrait('Army') || card.hasTrait('House Tarly')),
                    effect: ability.effects.doesNotKneelAsAttacker()
                }));

                this.game.addMessage(
                    '{0} plays {1} to have each {2} or {3} character they control not kneel during the first challenge they initiate this phase',
                    context.player,
                    this,
                    'Army',
                    'House Tarly'
                );
            }
        });
    }

    getNumberOfReach() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'location' && card.hasTrait('The Reach')
        );
    }

    isAttackingInFirstChallenge() {
        return !this.tracker.some({ attackingPlayer: this.controller });
    }
}

FirstInBattle.code = '20039';

module.exports = FirstInBattle;
