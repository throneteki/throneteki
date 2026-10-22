import DrawCard from '../../drawcard.js';

function anyOpponentHasKing(source) {
    return source.game.anyCardsInPlay(
        (card) =>
            card.controller !== source.controller &&
            card.getType() === 'character' &&
            card.hasTrait('King')
    );
}

class KingsHuntingParty extends DrawCard {
    // King's Hunting Party (01055)
    // No attachments.
    // While an opponent controls a King character, King's Hunting Party gains an [intrigue] icon .
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => anyOpponentHasKing(context.source),
            match: this,
            effect: ability.effects.addIcon('intrigue')
        });
    }
}

KingsHuntingParty.code = '01055';

export default KingsHuntingParty;
