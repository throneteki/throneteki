import DrawCard from '../../drawcard.js';

class TheTickler extends DrawCard {
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
