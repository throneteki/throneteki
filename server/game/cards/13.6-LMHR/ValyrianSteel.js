import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class ValyrianSteel extends AgendaCard {
    // Valyrian Steel (13118)
    // Your minimum deck size is 75 cards. Your deck cannot include more than 1 copy of each
    // attachment (by title).
    // Action: Kneel your faction card and pay X gold to put an attachment with printed cost X into
    // play from your hand.
    // Reaction: After an attachment enters play under your control, either: draw a card or gain 1
    // gold. (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Put attachment into play',
            cost: [
                ability.costs.kneelFactionCard(),
                ability.costs.payXGold(
                    (context) => Math.min(...attachmentCosts(context.player)),
                    (context) => Math.max(...attachmentCosts(context.player))
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
            message: {
                format: '{player} uses {source}, kneels their faction card and pays {xValue} to put {target} into play',
                args: { xValue: (context) => context.xValue }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.controller === context.player &&
                    event.card.getType() === 'attachment' &&
                    (context.player.canDraw() || context.player.canGainGold())
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
            limit: ability.limit.perRound(3)
        });
    }
}

function attachmentCosts(player) {
    return player.hand
        .filter((card) => card.getType() === 'attachment' && card.hasPrintedCost())
        .map((card) => card.getPrintedCost());
}

ValyrianSteel.code = '13118';

export default ValyrianSteel;
