const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class IronVictorysCrew extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            message: '{player} uses {source} to search their deck for a Warship location',
            gameAction: GameActions.search({
                title: 'Select a location',
                match: { type: 'location', trait: 'Warship' },
                message: '{player} {gameAction}',
                gameAction: GameActions.ifCondition({
                    condition: (context) => context.searchTarget.name === 'Iron Victory',
                    thenAction: GameActions.putIntoPlay((context) => ({
                        card: context.searchTarget
                    })),
                    elseAction: GameActions.addToHand((context) => ({
                        card: context.searchTarget
                    }))
                })
            })
        });
    }
}

IronVictorysCrew.code = '11091';

module.exports = IronVictorysCrew;
