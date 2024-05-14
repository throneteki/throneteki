import DrawCard from '../../drawcard.js';

class IsleOfRavens extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: "Shuffle discarded card back into owner's deck",
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) => card.location === 'discard pile'
            },
            handler: (context) => {
                context.target.owner.moveCard(context.target, 'draw deck');
                context.target.owner.shuffleDrawDeck();
                this.game.addMessage(
                    "{0} kneels {1} to shuffle {2} back into {3}'s deck",
                    this.controller,
                    this,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

IsleOfRavens.code = '04078';

export default IsleOfRavens;
