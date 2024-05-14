const DrawCard = require('../../drawcard.js');

class Kingslayer extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Kingsguard' });

        this.action({
            title: 'Kill character',
            limit: ability.limit.perGame(1),
            cost: ability.costs.kneelParent(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPower() >= 2,
                gameAction: 'kill'
            },
            handler: (context) => {
                this.game.killCharacter(context.target);
                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to kill {3}',
                    context.player,
                    this,
                    this.parent,
                    context.target
                );
            }
        });

        this.forcedInterrupt({
            when: {
                onCardLeftPlay: (event) => event.card === this.parent
            },
            handler: (context) => {
                for (let player of this.game.getPlayers()) {
                    if (player !== this.controller && player.canGainFactionPower()) {
                        this.game.addPower(player, 2);
                    }
                }

                this.game.addMessage(
                    '{0} is forced by {1} to have each opponent gain 2 power for their faction',
                    context.player,
                    this
                );
            }
        });
    }
}

Kingslayer.code = '08030';

module.exports = Kingslayer;
