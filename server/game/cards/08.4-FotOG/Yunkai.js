const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class Yunkai extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove characters from challenge',
            condition: () => this.game.currentChallenge && this.game.currentChallenge.attackingPlayer === this.controller &&
                             this.game.currentChallenge.getNumberOfParticipants() > 0,
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.discardXGold(() => this.getLowestParticipatingStr(), () => this.getHighestParticipatingStr())
            ],
            handler: context => {
                let participantsToRemove = this.game.filterCardsInPlay(card => this.game.currentChallenge.isParticipating(card) && card.getStrength() <= context.xValue);

                _.each(participantsToRemove, card => {
                    this.game.currentChallenge.removeFromChallenge(card);
                });

                this.game.addMessage('{0} kneels and discards {1} gold from {2} to remove all characters with STR {1} or lower from the challenge',
                    context.player, context.xValue, this);
                
                this.game.once('afterChallenge', event => this.onChallengeWon(event.challenge));
            }
        });
    }

    onChallengeWon(challenge) {
        if(challenge.winner !== this.controller || this.location !== 'play area') {
            return;
        }

        this.modifyToken('gold', 2);
        this.game.addMessage('{0} places 2 gold tokens from the treasury on {1}', this.controller, this);
    }

    getLowestParticipatingStr() {
        let strengths = this.getParticipatingStrengths();
        let lowestStrength = _.min(strengths);
        return _.max([lowestStrength, 1]);
    }

    getHighestParticipatingStr() {
        let strengths = this.getParticipatingStrengths();
        let highestStrength = _.max(strengths);
        return _.max([highestStrength, 1]);
    }

    getParticipatingStrengths() {
        let participatingCharacters = this.game.filterCardsInPlay(card => this.game.currentChallenge.isParticipating(card));
        return _.map(participatingCharacters, card => card.getStrength());
    }
}

Yunkai.code = '08074';

module.exports = Yunkai;
