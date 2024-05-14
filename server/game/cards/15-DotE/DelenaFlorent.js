const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class DelenaFlorent extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'challenge',
            match: (card) => card.isMatch({ type: 'character', not: { trait: 'Bastard' } }),
            targetController: 'any',
            effect: ability.effects.cannotBeStood()
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
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

module.exports = DelenaFlorent;
