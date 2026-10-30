import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DelenaFlorent extends DrawCard {
    // Delena Florent (15025)
    // During the challenges phase, non-Bastard characters cannot stand.
    // Reaction: After Delena Florent enters play, search your deck for a Bastard character, reveal
    // it, and add it to your hand. Shuffle your deck.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.currentPhase === 'challenge',
            match: (card) => card.isMatch({ type: 'character', not: { trait: 'Bastard' } }),
            targetController: 'any',
            effect: ability.effects.cannotBeStood()
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            message: '{player} uses {source} to search their deck for a Bastard character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { trait: 'Bastard', type: 'character' },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

DelenaFlorent.code = '15025';

export default DelenaFlorent;
