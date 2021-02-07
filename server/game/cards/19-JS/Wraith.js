const DrawCard = require('../../drawcard');

class Wraith extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Dale Seaworth',
            effect: ability.effects.addKeyword('stealth')
        });

        this.action({
            title: 'Kneel location',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrificeSelf()
            ],
            targets: {
                location: {
                    activePromptTitle: 'Select a location',
                    cardCondition: card => card.location === 'play area' && card.getType() === 'location' && !card.kneeled,
                    gameAction: 'kneel'
                }
            },
            handler: context => {
                this.game.addMessage('{0} kneels and sacrifices {1} to kneel {2}', context.player, this, context.targets.location);
                context.targets.location.controller.kneelCard(context.targets.location);
            }
        });
    }
}

Wraith.code = '19001';

module.exports = Wraith;
