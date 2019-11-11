const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class FireMadeFlesh extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search your hand and deck',
            phase: 'marshal',
            cost: ability.costs.sacrifice({ trait: 'Hatchling', type: 'character' }),
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.search({
                        title: 'Select a character',
                        match: {
                            location: ['draw deck', 'hand'],
                            trait: 'Dragon', type: 'character',
                            condition: (card, context) => card.name === context.costs.sacrifice.name
                        },
                        message: {
                            format: '{player} plays {source} and sacrifices {sacrificedCard} to search their deck and hand, and put {searchTarget} into play from their {searchTargetLocation}',
                            args: {
                                sacrificedCard: context => context.costs.sacrifice,
                                searchTargetLocation: context => context.searchTarget.location
                            }
                        },
                        cancelMessage: {
                            format: '{player} plays {source} and sacrifices {sacrificedCard} to search their deck and hand, but does not find a card',
                            args: { sacrificedCard: context => context.costs.sacrifice }
                        },
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

FireMadeFlesh.code = '15023';

module.exports = FireMadeFlesh;
