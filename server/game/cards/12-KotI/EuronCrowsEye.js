import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class EuronCrowsEye extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
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
