const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class GreatRanging extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });
        
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            message: '{player} uses {source} to search their deck for First of the First Men',
            gameAction: GameActions.search({
                title: 'Select a card',
                match: { name: 'Fist of the First Men' },
                reveal: false,
                location: ['draw deck', 'hand', 'discard pile'],
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay(context => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

GreatRanging.code = '21013';

module.exports = GreatRanging;
