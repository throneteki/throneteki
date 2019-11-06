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
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.search({
                        title: 'Select a Hatchling character',
                        match: { type: 'character', trait: 'Hatchling' },
                        message: '{player} uses {source} to search their deck and put {searchTarget} into play',
                        cancelMessage: '{player} uses {source} to search their deck but does not find a card',
                        gameAction: GameActions.putIntoPlay(context => ({
                            player: context.player,
                            card: context.searchTarget
                        }))
                    }),
                    context
                );
            }
        });
    }
}

DragonEgg.code = '15020';

module.exports = DragonEgg;
