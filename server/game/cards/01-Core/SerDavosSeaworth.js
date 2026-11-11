import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerDavosSeaworth extends DrawCard {
    // Ser Davos Seaworth (01050)
    // Stealth.
    // Interrupt: When Ser Davos Seaworth is killed, return him to your hand instead of placing him
    // in your dead pile.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, context) => event.card === context.source
            },
            message:
                '{player} uses {source} to return {source} to their hand instead of their dead pile',
            gameAction: GameActions.replaceEvent((context) => ({
                event: context.event,
                replacement: GameActions.placeCard({ card: context.source, location: 'hand' })
            }))
        });
    }
}

SerDavosSeaworth.code = '01050';

export default SerDavosSeaworth;
