import DrawCard from '../../drawcard.js';

class LazyLeo extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                type: 'select',
                activePromptTitle: 'Select any number of events',
                cardCondition: (card) =>
                    card.location === 'discard pile' && card.getType() === 'event',
                mode: 'unlimited',
                singleController: true
            },
            handler: (context) => {
                for (let card of context.target) {
                    card.owner.moveCard(card, 'draw deck', {}, () => {
                        card.owner.shuffleDrawDeck();
                    });
                }

                this.game.addMessage(
                    "{0} uses {1} to shuffle {2} into {3}'s deck",
                    context.player,
                    this,
                    context.target,
                    context.target[0].owner
                );
            }
        });
    }
}

LazyLeo.code = '11043';

export default LazyLeo;
