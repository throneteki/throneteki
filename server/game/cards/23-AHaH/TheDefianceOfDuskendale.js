import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class TheDefianceOfDuskendale extends PlotCard {
    // The Defiance of Duskendale (23038)
    // Reaction: After a location is knelt by assault, discard it from play.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: (event) =>
                    event.card.getType() === 'location' && event.reason === 'assault'
            },
            message: {
                format: '{player} uses {source} to discard {location}',
                args: { location: (context) => context.event.card }
            },
            gameAction: GameActions.discardCard((context) => ({ card: context.event.card }))
        });
    }
}

TheDefianceOfDuskendale.code = '23038';

export default TheDefianceOfDuskendale;
