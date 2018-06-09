const DrawCard = require('../../drawcard');

class WymanManderly extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice a character',
            target: {
                type: 'select',
                cardCondition: card => card.location === 'play area' && card.controller === this.controller &&
                                       card.getType() === 'character'
            },
            handler: context => {
                context.player.sacrificeCard(context.target);
                this.game.addMessage('{0} uses {1} to sacrifice {2}', context.player, this, context.target);
            }
        });
        this.reaction({
            when: {
                onSacrificed: event => event.card.controller === this.controller && event.card.getType() === 'character' &&
                                       this.canChangeGameState(),
                onCharactersKilled: event => event.snapshots.some(card => card.controller === this.controller) &&
                                             this.canChangeGameState()
            },
            limit: ability.limit.perRound(3),
            handler: context => {
                let bonusMessages = [];

                if(this.kneeled) {
                    context.player.standCard(this);
                    bonusMessages.push('stand {1}');
                }

                if(this.controller.canDraw()) {
                    context.player.drawCardsToHand(1).length;
                    bonusMessages.push('draw 1 card');
                }
                
                this.game.addMessage('{0} uses {1} to ' + bonusMessages.join(' and '), context.player, this);
            }
        });
    }

    canChangeGameState() {
        return this.controller.canDraw() || this.kneeled;
    }
}

WymanManderly.code = '11021';

module.exports = WymanManderly;
