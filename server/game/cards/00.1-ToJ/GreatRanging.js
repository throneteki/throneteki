import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GreatRanging extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            message: '{player} uses {source} to search their deck for a location',
            gameAction: GameActions.search({
                title: 'Select a location',
                match: {
                    type: 'location',
                    limited: false
                },
                location: ['draw deck', 'discard pile'],
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

GreatRanging.code = '00197';

export default GreatRanging;
