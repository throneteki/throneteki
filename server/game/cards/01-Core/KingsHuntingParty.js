import DrawCard from '../../drawcard.js';

class KingsHuntingParty extends DrawCard {
    // King's Hunting Party (01055)
    // No attachments.
    // While an opponent controls a King character, King's Hunting Party gains an [intrigue] icon .
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.anyOpponentHasKing(),
            match: this,
            effect: ability.effects.addIcon('intrigue')
        });
    }

    anyOpponentHasKing() {
        return this.game.anyCardsInPlay(
            (card) =>
                card.controller !== this.controller &&
                card.getType() === 'character' &&
                card.hasTrait('King')
        );
    }
}

KingsHuntingParty.code = '01055';

export default KingsHuntingParty;
