const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class DragonEgg extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('Insight')
        });

        this.reaction({
            when: {
                onPhaseStarted: event => event.phase === 'marshal' && this.parent.name === 'Daenerys Targaryen'
            },
            cost: ability.costs.sacrificeSelf(),
            message: '{player} uses {source} to search their deck for a Hatchling character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', trait: 'Hatchling' },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay(context => ({
                    player: context.player,
                    card: context.searchTarget
                }))
            })
        });
    }
}

DragonEgg.code = '15020';

module.exports = DragonEgg;
