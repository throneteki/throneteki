import DrawCard from '../../drawcard.js';

class EvenHandedJustice extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel a character for each player',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.kneeled,
                mode: 'eachPlayer',
                gameAction: 'kneel'
            },
            handler: (context) => {
                for (let card of context.target) {
                    card.controller.kneelCard(card);
                }
                this.game.addMessage(
                    '{0} plays {1} to kneel {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

EvenHandedJustice.code = '03026';

export default EvenHandedJustice;
