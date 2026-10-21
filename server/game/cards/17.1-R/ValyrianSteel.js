import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class ValyrianSteel extends AgendaCard {
    // Valyrian Steel (17152)
    // Your minimum deck size is 75 cards. Your deck cannot include more than 1 copy of each
    // attachment.
    // Action: Kneel your faction card and pay X gold to put an attachment with printed cost X into
    // play from your hand.
    // Reaction: After an attachment enters play under your control, either: draw a card or gain 1
    // gold. (Limit once per phase.)
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
                'Gain 1 gold': {
                    message: '{player} uses {source} to gain 1 gold',
                    gameAction: GameActions.gainGold((context) => ({
                        player: context.player,
                        amount: 1
                    }))
                },
                'Draw 1 card': {
                    message: '{player} uses {source} to draw 1 card',
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 1
                    }))
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

export default ValyrianSteel;
