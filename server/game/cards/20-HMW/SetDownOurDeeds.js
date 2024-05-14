const DrawCard = require('../../drawcard');

class SetDownOurDeeds extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard power to draw',
            condition: () => this.controller.canDraw(),
            cost: ability.costs.kneelFactionCard(),
            target: {
                activePromptTitle: 'Select card with power',
                cardCondition: (card, context) =>
                    card.owner === context.player &&
                    ['active plot', 'faction', 'play area'].includes(card.location) &&
                    card.power > 0,
                cardType: ['attachment', 'character', 'faction', 'location', 'plot']
            },
            handler: (context) => {
                this.target = context.target;

                let nums = [];
                let maxAmount = Math.min(context.target.power, 3);
                for (var i = 1; i <= maxAmount; i++) {
                    nums.push(i);
                }
                let buttons = nums.map((num) => {
                    return { text: num, method: 'numSelected', arg: num };
                });

                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Select # of power to discard',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    numSelected(player, num) {
        this.game.addMessage(
            '{0} plays {1} and discards {2} power from {3} to draw {4}',
            player,
            this,
            num,
            this.target,
            num * 2
        );
        this.target.modifyPower(num * -1);
        player.drawCardsToHand(num * 2);
        this.target = undefined;
        return true;
    }
}

SetDownOurDeeds.code = '20005';

module.exports = SetDownOurDeeds;
