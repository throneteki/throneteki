import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OathswornWildling extends DrawCard {
    // Oathsworn Wildling (26029)
    // If you do not control another Wildling character or Jon Snow, sacrifice Oathsworn Wildling.
    setupCardAbilities() {
        this.stateCheck({
            condition: (context) =>
                !context.player.anyCardsInPlay(
                    (card) =>
                        card !== context.source &&
                        card.getType() === 'character' &&
                        (card.hasTrait('Wildling') || card.name === 'Jon Snow')
                ),
            message:
                '{player} sacrifices {source} as they control no other Wildling character or Jon Snow',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.source }))
        });
    }
}

OathswornWildling.code = '26029';

export default OathswornWildling;
