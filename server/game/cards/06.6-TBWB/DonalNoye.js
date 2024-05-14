const DrawCard = require('../../drawcard.js');

class DonalNoye extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put Weapon into play',
            cost: ability.costs.discardGold(),
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    card.hasTrait('weapon') &&
                    card.getType() === 'attachment'
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage(
                    '{0} discards 1 gold from {1} to put {2} into play',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

DonalNoye.code = '06105';

module.exports = DonalNoye;
