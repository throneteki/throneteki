import DrawCard from '../../drawcard.js';

class GwynesseHarlaw extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Place cards on bottom',
            limit: ability.limit.perRound(1),
            target: {
                mode: 'upTo',
                numCards: 3,
                activePromptTitle: 'Select cards (last chosen ends up on bottom)',
                cardCondition: (card) =>
                    card.location === 'discard pile' && card.controller !== this.controller,
                ordered: true
            },
            handler: (context) => {
                this.game.addMessage(
                    "{0} uses {1} to place {2} on the bottom of {3}'s deck",
                    context.player,
                    this,
                    context.target
                );
                for (let card of context.target) {
                    card.owner.moveCard(card, 'draw deck', { bottom: true });
                }

                let numCardsDrawn = context.player.drawCardsToHand(1).length;
                let goldGained = this.game.addGold(context.player, 1);
                this.game.addMessage(
                    'Then {0} draws {2} card and gains {3} gold',
                    context.player,
                    this,
                    numCardsDrawn,
                    goldGained
                );
            }
        });
    }
}

GwynesseHarlaw.code = '12007';

export default GwynesseHarlaw;
