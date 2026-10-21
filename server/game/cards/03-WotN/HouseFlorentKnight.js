import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HouseFlorentKnight extends DrawCard {
    // House Florent Knight (03037)
    // Forced Reaction: After House Florent Knight enters play, choose a character with the lowest
    // STR in play, and discard it from play.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card, context) => {
                    return (
                        card.getStrength() === context.source.getLowestStrInPlay() &&
                        card.location === 'play area' &&
                        card.getType() === 'character'
                    );
                }
            },
            message: '{player} uses {source} to discard {target}',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
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

export default HouseFlorentKnight;
