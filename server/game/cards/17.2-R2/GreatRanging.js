import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GreatRanging extends DrawCard {
    // Great Ranging (17170)
    // Assault. Intimidate. No attachments.
    // Reaction: After you marshal Great Ranging, search your hand, deck, and discard pile for Fist
    // of the First Men and put it into play. Shuffle your deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'marshal'
            },
            message: '{player} uses {source} to search their deck for First of the First Men',
            gameAction: GameActions.search({
                title: 'Select a card',
                match: { name: 'Fist of the First Men' },
                reveal: false,
                location: ['draw deck', 'hand', 'discard pile'],
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

GreatRanging.code = '17170';

export default GreatRanging;
