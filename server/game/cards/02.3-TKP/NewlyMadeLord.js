import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NewlyMadeLord extends DrawCard {
    // Newly-Made Lord (02051)
    // Reaction: After you marshal Newly-Made Lord, choose a non-limited location with printed cost
    // 3 or lower, and discard it from play.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'marshal'
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    !card.isLimited() &&
                    card.getPrintedCost() <= 3,
                gameAction: 'discard'
            },
            message: '{player} uses {source} to discard {target}',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
    }
}

NewlyMadeLord.code = '02051';

export default NewlyMadeLord;
