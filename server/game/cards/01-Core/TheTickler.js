import DrawCard from '../../drawcard.js';

class TheTickler extends DrawCard {
    // The Tickler (01088)
    // Dominance Action: Kneel The Tickler to discard the top card of an opponent's deck. Then, you
    // may choose 1 copy of that card, and discard it from play.
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard opponents top card',
            phase: 'dominance',
            chooseOpponent: true,
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                context.opponent.discardFromDraw(1, (cards) => {
                    let topCard = cards[0];
                    this.game.addMessage(
                        "{0} uses {1} to discard the top card of {2}'s deck",
                        this.controller,
                        this,
                        context.opponent
                    );

                    this.game.promptForSelect(this.controller, {
                        activePromptTitle: 'Select a copy of ' + topCard.name,
                        source: this,
                        cardCondition: (card) =>
                            card.location === 'play area' && card.isCopyOf(topCard),
                        onSelect: (p, card) => this.onCardSelected(p, card)
                    });
                });
            }
        });
    }

    onCardSelected(player, card) {
        card.controller.discardCard(card);

        this.game.addMessage('{0} uses {1} to discard a copy of {2} from play', player, this, card);

        return true;
    }
}

TheTickler.code = '01088';

export default TheTickler;
