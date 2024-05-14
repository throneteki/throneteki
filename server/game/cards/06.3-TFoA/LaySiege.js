const DrawCard = require('../../drawcard.js');

class LaySiege extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel or discard location',
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'location' && !card.kneeled,
                gameAction: 'kneel'
            },
            handler: (context) => {
                this.controller.kneelCard(context.target);
                let sacMessage = '';

                if (context.target.hasTrait('Contested')) {
                    context.target.controller.discardCard(context.target);
                    sacMessage = ' and then discard it from play';
                }
                this.game.addMessage(
                    '{0} uses {1} to kneel {2}{3}',
                    this.controller,
                    this,
                    context.target,
                    sacMessage
                );
            }
        });
    }
}

LaySiege.code = '06059';

module.exports = LaySiege;
