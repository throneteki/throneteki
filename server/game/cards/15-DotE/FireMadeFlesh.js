const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class FireMadeFlesh extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search your hand and deck',
            phase: 'marshal',
            cost: ability.costs.sacrifice({ trait: 'Hatchling', type: 'character' }),
            message: '{player} plays {source} and sacrifices {costs.sacrifice} to search their hand and deck for a Dragon character with the same title',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: {
                    location: ['draw deck', 'hand'],
                    trait: 'Dragon', type: 'character',
                    condition: (card, context) => card.name === context.costs.sacrifice.name
                },
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

FireMadeFlesh.code = '15023';

module.exports = FireMadeFlesh;
