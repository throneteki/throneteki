import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Stormlord extends DrawCard {
    // Stormlord (26041)
    // Renown.
    // Forced Reaction: After the dominance phase begins, if you control no King characters,
    // sacrifice a character.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event, context) =>
                    event.phase === 'dominance' &&
                    !context.player.anyCardsInPlay({ type: 'character', trait: 'king' })
            },
            message: '{player} is forced by {source} to sacrifice a character',
            gameAction: GameActions.chooseCards({
                title: 'Select a character to sacrifice',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.choosingPlayer,
                gameAction: (card) => GameActions.sacrificeCard({ card })
            })
        });
    }
}

Stormlord.code = '26041';

export default Stormlord;
