const DrawCard = require('../../drawcard');

class Foamdrinker extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Dagmer Cleftjaw',
            effect: ability.effects.addKeyword('Assault')
        });

        this.action({
            title: 'Give icon',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    (card.hasTrait('Captain') || card.hasTrait('Raider'))
            },
            handler: (context) => {
                this.game.promptForIcon(context.player, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: ability.effects.addIcon(icon)
                    }));

                    this.game.addMessage(
                        '{0} kneels {1} to give {2} {3} icon to {4} until the end of the phase',
                        context.player,
                        this,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon,
                        context.target
                    );
                });
            }
        });
    }
}

Foamdrinker.code = '21005';

module.exports = Foamdrinker;
