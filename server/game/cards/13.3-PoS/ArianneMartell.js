const DrawCard = require('../../drawcard');

class ArianneMartell extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card.controller === this.controller
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                this.game.promptForIcon(context.player, this, (icon) => {
                    this.game.addMessage(
                        '{0} uses {1} to remove {2} {3} icon from {4}',
                        context.player,
                        this,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon,
                        context.target
                    );
                    this.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }));
                });
            },
            limit: ability.limit.perRound(3)
        });
    }
}

ArianneMartell.code = '13055';

module.exports = ArianneMartell;
