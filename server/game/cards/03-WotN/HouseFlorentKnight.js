const DrawCard = require('../../drawcard.js');

class HouseFlorentKnight extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                cardCondition: (card) => {
                    return (
                        card.getStrength() === this.getLowestStrInPlay() &&
                        card.location === 'play area' &&
                        card.getType() === 'character'
                    );
                }
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to discard {2}',
                    context.player,
                    this,
                    context.target
                );
                context.target.controller.discardCard(context.target);
            }
        });
    }

    getLowestStrInPlay() {
        let charactersInPlay = this.game.filterCardsInPlay(
            (card) => card.getType() === 'character'
        );
        let strengths = charactersInPlay.map((card) => card.getStrength());
        return Math.min(...strengths);
    }
}
HouseFlorentKnight.code = '03037';

module.exports = HouseFlorentKnight;
