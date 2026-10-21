import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class EuronCrowsEye extends DrawCard {
    // Euron Crow's Eye (12002)
    // Intimidate.
    // Reaction: After you marshal Euron Crow's Eye, search your hand, deck, and discard pile for
    // Silence and put it into play. Shuffle your deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'marshal'
            },
            message:
                '{player} uses {source} to search their hand, deck and discard pile for Silence',
            gameAction: GameActions.search({
                title: 'Select a card',
                match: { name: 'Silence' },
                location: ['hand', 'draw deck', 'discard pile'],
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

EuronCrowsEye.code = '12002';

export default EuronCrowsEye;
