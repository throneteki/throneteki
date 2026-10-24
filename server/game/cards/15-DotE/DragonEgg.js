import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DragonEgg extends DrawCard {
    // Dragon Egg (15020)
    // Attached character gains insight.
    // Reaction: After the marshaling phase begins, if attached character is Daenerys Targaryen,
    // sacrifice Dragon Egg to search your deck for a Hatchling character and put it into play.
    // Shuffle your deck.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('Insight')
        });

        this.reaction({
            when: {
                onPhaseStarted: (event, context) =>
                    event.phase === 'marshal' && context.source.parent.name === 'Daenerys Targaryen'
            },
            cost: ability.costs.sacrificeSelf(),
            message: '{player} uses {source} to search their deck for a Hatchling character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', trait: 'Hatchling' },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    player: context.player,
                    card: context.searchTarget
                }))
            })
        });
    }
}

DragonEgg.code = '15020';

export default DragonEgg;
