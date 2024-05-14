const DrawCard = require('../../drawcard');

class BrazenBeast extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into shadows',
            // Explicitly make this activated by click instead of menu so that
            // it isn't necessary to introduce menus while a card is out-of-play
            clickToActivate: true,
            location: 'discard pile',
            phase: 'marshal',
            cost: ability.costs.payGold(3),
            handler: (context) => {
                this.game.addMessage(
                    '{0} pays 3 gold to put {1} into shadows',
                    context.player,
                    this
                );
                context.player.putIntoShadows(this);
            }
        });
    }
}

BrazenBeast.code = '11113';

module.exports = BrazenBeast;
