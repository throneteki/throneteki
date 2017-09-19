const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class KingsBlood extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard power from opponent\'s faction',
            condition: () => {
                //Possible TODO: incorporate snapshot functionality
                if(this.hasToken('gold')) {
                    this.parentCard = this.parent;
                    this.gold = this.tokens['gold'];
                    return true;
                }
                return false;
            },
            cost: [
                ability.costs.kneelParent(),
                ability.costs.sacrificeSelf()
            ],
            handler: context => {
                _.each(this.game.getPlayers(), player => {
                    if(player !== context.player) {
                        this.game.addPower(player, -this.gold);
                    }
                });

                this.game.addMessage('{0} kneels {1} and sacrifices {2} to discard {3} power from each opponent\'s faction card',
                    context.player, this.parentCard, this, this.gold);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !(card.hasTrait('Bastard') || card.hasTrait('King')) || card.controller !== this.controller) {
            return false;
        }
        return super.canAttach(player, card);
    }
}

KingsBlood.code = '06108';

module.exports = KingsBlood;
