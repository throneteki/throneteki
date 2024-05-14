const AgendaCard = require('../../agendacard');

class ValyrianSteel extends AgendaCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put attachment into play',
            cost: [
                ability.costs.kneelFactionCard(),
                ability.costs.payXGold(
                    () => Math.min(...this.attachmentCosts()),
                    () => Math.max(...this.attachmentCosts())
                )
            ],
            target: {
                type: 'select',
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) =>
                    card.controller === context.player &&
                    card.location === 'hand' &&
                    card.getType() === 'attachment' &&
                    card.hasPrintedCost() &&
                    (context.xValue === undefined || card.getPrintedCost() === context.xValue) &&
                    context.player.canPutIntoPlay(card)
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1}, kneels their faction card and pays {2} to put {3} into play',
                    context.player,
                    this,
                    context.xValue,
                    context.target
                );
                context.player.putIntoPlay(context.target);
            }
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.controller === this.controller &&
                    event.card.getType() === 'attachment' &&
                    (this.controller.canDraw() || this.controller.canGainGold())
            },
            choices: {
                'Gain 1 gold': (context) => {
                    if (context.player.canGainGold()) {
                        this.game.addGold(context.player, 1);
                        this.game.addMessage('{0} uses {1} to gain 1 gold', context.player, this);
                    }
                },
                'Draw 1 card': (context) => {
                    if (context.player.canDraw()) {
                        context.player.drawCardsToHand(1);
                        this.game.addMessage('{0} uses {1} to draw 1 card', context.player, this);
                    }
                }
            },
            limit: ability.limit.perPhase(1)
        });
    }

    attachmentCosts() {
        const attachments = this.controller.hand.filter(
            (card) => card.getType() === 'attachment' && card.hasPrintedCost()
        );
        return attachments.map((card) => card.getPrintedCost());
    }
}

ValyrianSteel.code = '17152';

module.exports = ValyrianSteel;
