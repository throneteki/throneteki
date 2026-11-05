import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AndrikTheUnsmiling extends DrawCard {
    // Andrik the Unsmiling (12008)
    // Pillage.
    // Reaction: After Andrik the Unsmiling discards a card using pillage, choose a non-limited
    // location or attachment in the losing opponent's discard pile. Discard 1 copy of that card
    // from play.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage &&
                    context.game.currentChallenge.winner === context.player &&
                    event.source === context.source
            },
            target: {
                activePromptTitle: 'Select a location or attachment',
                cardCondition: (card, context) =>
                    card.controller === context.game.currentChallenge.loser &&
                    !card.isLimited() &&
                    ['location', 'attachment'].includes(card.getType()) &&
                    card.location === 'discard pile'
            },
            message: '{player} uses {source} to discard a copy of {target} from play',
            gameAction: GameActions.chooseCards({
                title: (context) => `Select a copy of ${context.target.name}`,
                cardCondition: (card, context) =>
                    card.location === 'play area' && card.isCopyOf(context.target),
                gameAction: (card) => GameActions.discardCard({ card })
            })
        });
    }
}

AndrikTheUnsmiling.code = '12008';

export default AndrikTheUnsmiling;
