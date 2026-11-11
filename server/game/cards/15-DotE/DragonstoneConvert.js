import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DragonstoneConvert extends DrawCard {
    // Dragonstone Convert (15026)
    // Challenges Action: Name an event. Until the end of the phase, events with that title cannot
    // be played. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Prevent event',
            phase: 'challenge',
            gameAction: GameActions.nameCard({
                title: 'Name an event',
                match: (cardData) => cardData.type === 'event',
                message:
                    '{player} uses {source} to prevent events with the title {cardName} from being played until the end of the phase',
                gameAction: GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    targetController: 'any',
                    effect: ability.effects.cannotPlay(
                        (card) => card.name.toLowerCase() === context.namedCard.toLowerCase()
                    )
                }))
            }),
            limit: ability.limit.perPhase(1)
        });
    }
}

DragonstoneConvert.code = '15026';

export default DragonstoneConvert;
