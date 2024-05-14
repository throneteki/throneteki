const DrawCard = require('../../drawcard.js');

class MareInHeat extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Knight' });
        this.action({
            title: 'Remove character from challenge',
            condition: () =>
                this.game.isDuringChallenge({ attackingAlone: this.parent }) ||
                this.game.isDuringChallenge({ defendingAlone: this.parent }),
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.isParticipating() &&
                    card.getStrength() > this.parent.getStrength()
            },
            handler: (context) => {
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.game.addMessage(
                    '{0} kneels {1} to remove {2} from the challenge',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

MareInHeat.code = '02044';

module.exports = MareInHeat;
