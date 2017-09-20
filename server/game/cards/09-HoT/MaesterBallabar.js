const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class MaesterBallabar extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and remove character from challenge',
            condition: () => this.game.currentChallenge && this.game.currentChallenge.anyParticipants(card => card.controller === this.controller),
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: card => this.game.currentChallenge.isParticipating(card) && card.getStrength() === this.getLowestParticipatingStrength()
            },
            handler: context => {
                context.target.controller.standCard(context.target);
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.game.addMessage('{0} kneels {1} to stand and remove {2} from the challenge', context.player, this, context.target);
            }
        });
    }

    getLowestParticipatingStrength() {
        let participatingCharacters = this.game.currentChallenge.attackers.concat(this.game.currentChallenge.defenders);
        let strengths = _.map(participatingCharacters, card => card.getStrength());
        return _.min(strengths);
    }
}

MaesterBallabar.code = '09014';

module.exports = MaesterBallabar;
