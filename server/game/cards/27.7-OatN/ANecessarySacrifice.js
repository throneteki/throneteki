import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ANecessarySacrifice extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) => !event.card.isFaction('stark')
            },
            message: {
                format: '{player} plays {source} to save {character}',
                args: { character: (context) => context.event.card }
            },
            gameAction: GameActions.genericHandler((context) => {
                // TODO: Convert to gameaction, somehow
                context.event.saveCard();
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select another character',
                    cardCondition: (card) =>
                        card.getType() === 'character' && card !== context.event.card,
                    onSelect: (player, card) => {
                        this.game.addMessage('Then, {0} sacrifices {1}', player, card);
                        this.game.resolveGameAction(GameActions.sacrificeCard({ card }));
                        return true;
                    },
                    onCancel: (player) => {
                        this.game.addMessage(
                            '{0} does not choose to sacrifice a character',
                            player
                        );
                        return true;
                    },
                    source: this
                });
            })
        });
    }
}
ANecessarySacrifice.code = '27547';
ANecessarySacrifice.version = '1.0.0';

export default ANecessarySacrifice;
