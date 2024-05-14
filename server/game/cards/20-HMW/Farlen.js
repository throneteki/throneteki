const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Farlen extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Direwolf') && card.isUnique(),
            effect: ability.effects.addKeyword('Renown')
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            message:
                '{player} uses {source} to search their hand, deck and discard pile for The Wolfswood',
            gameAction: GameActions.search({
                title: 'Select a card',
                match: { name: 'The Wolfswood' },
                reveal: false,
                location: ['hand', 'draw deck', 'discard pile'],
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

Farlen.code = '20026';

module.exports = Farlen;
