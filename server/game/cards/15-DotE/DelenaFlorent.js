const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class DelenaFlorent extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'challenge',
            match: card => card.isMatch({ type: 'character', not: { trait: 'Bastard' } }),
            targetController: 'any',
            effect: ability.effects.cannotBeStood()
        });

        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.search({
                        title: 'Select a character',
                        match: { trait: 'Bastard', type: 'character' },
                        message: '{player} uses {source} to search their deck and adds {searchTarget} to their hand',
                        gameAction: GameActions.addToHand(context => ({
                            card: context.searchTarget
                        }))
                    }),
                    context
                );
            }
        });
    }
}

DelenaFlorent.code = '15025';

module.exports = DelenaFlorent;
