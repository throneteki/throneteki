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
            handler: (context) => {
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select a character to sacrifice',
                    source: this,
                    gameAction: 'sacrifice',
                    cardCondition: (card) =>
                        card.location === 'play area' &&
                        card.getType() === 'character' &&
                        card.controller === context.player,
                    onSelect: (p, card) => {
                        this.game.resolveGameAction(GameActions.sacrificeCard({ card }));
                        this.game.addMessage('{0} chooses to sacrifice {1}', context.player, card);
                        return true;
                    }
                });
            }
        });
    }
}

Stormlord.code = '26041';

export default Stormlord;
