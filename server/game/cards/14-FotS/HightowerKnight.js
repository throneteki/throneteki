const DrawCard = require('../../drawcard');

class HightowerKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            location: 'hand',
            condition: () => this.controller.canPutIntoPlay(this),
            cost: ability.costs.kneel(
                (card) =>
                    card.getType() === 'character' &&
                    !card.isFaction('tyrell') &&
                    card.hasTrait('Knight')
            ),
            message: {
                format: '{player} uses {source} and kneels {kneeledCard} to put {source} into play',
                args: { kneeledCard: (context) => context.costs.kneel }
            },
            handler: (context) => {
                context.player.putIntoPlay(this);
            }
        });
    }
}

HightowerKnight.code = '14037';

module.exports = HightowerKnight;
