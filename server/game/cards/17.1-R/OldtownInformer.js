import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class OldtownInformer extends DrawCard {
    // Oldtown Informer (17138)
    // Ambush (2). Bestow (3).
    // Reaction: After a card enters play during the challenges phase, draw X cards. Then, discard X
    // cards. X is the number of gold Oldtown Informer has. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: () =>
                    this.game.currentPhase === 'challenge' &&
                    this.tokens[Tokens.gold] >= 1 &&
                    this.controller.canDraw()
            },
            limit: ability.limit.perPhase(2),
            handler: () => {
                this.controller.drawCardsToHand(this.tokens[Tokens.gold]);
                this.game.addMessage(
                    '{0} uses {1} to draw {2} cards',
                    this.controller,
                    this,
                    this.tokens[Tokens.gold]
                );

                this.game.promptForSelect(this.controller, {
                    mode: 'exactly',
                    numCards: this.tokens[Tokens.gold],
                    activePromptTitle: 'Select ' + this.tokens[Tokens.gold] + ' cards',
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'hand' && card.controller === this.controller,
                    onSelect: (player, cards) => this.cardsSelected(player, cards)
                });
            }
        });
    }

    cardsSelected(player, cards) {
        player.discardCards(cards);
        this.game.addMessage('{0} then discards {1} for {2}', this.controller, cards, this);
        return true;
    }
}

OldtownInformer.code = '17138';

export default OldtownInformer;
