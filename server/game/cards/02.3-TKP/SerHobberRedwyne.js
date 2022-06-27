const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class SerHobberRedwyne extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            message: '{player} uses {source} to search their deck for a Lady character',
            gameActions: GameActions.search({
                title: 'Select a character',
                match: {
                    type: 'character',
                    trait: 'Lady'
                },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand(context => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

SerHobberRedwyne.code = '02043';

module.exports = SerHobberRedwyne;
