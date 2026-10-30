import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerGregorsMarauders extends DrawCard {
    // Ser Gregor's Marauders (05008)
    // Pillage.
    // Reaction: After Ser Gregor's Marauders discards an event using pillage, stand Ser Gregor's
    // Marauders.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage &&
                    event.source === context.source &&
                    event.card.getType() === 'event'
            },
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

SerGregorsMarauders.code = '05008';

export default SerGregorsMarauders;
