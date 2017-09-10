const DrawCard = require('../../drawcard.js');

class ScorchingDeserts extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: context => context.event.card.name,
            when: {
                onDeclaredAsAttacker: event => event.card.getNumberOfIcons() < 2 && event.card.controller !== this.controller,
                onDeclaredAsDefender: event => event.card.getNumberOfIcons() < 2 && event.card.controller !== this.controller
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrificeSelf()
            ],
            handler: context => {
                this.game.currentChallenge.removeFromChallenge(context.event.card);
                this.game.addMessage('{0} kneels and sacrifices {1} to remove {2} from the challenge',
                    this.controller, this, context.event.card);
            }
        });
    }
}

ScorchingDeserts.code = '06036';

module.exports = ScorchingDeserts;
