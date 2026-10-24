import DrawCard from '../../drawcard.js';

class DragonSkull extends DrawCard {
    // Dragon Skull (13074)
    // [targaryen] character only. Shadow (2).
    // While there are no Dragon characters in play, attached character gains intimidate and renown.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen' });
        this.whileAttached({
            condition: (context) => context.source.areNoDragonsInPlay(),
            effect: [ability.effects.addKeyword('Intimidate'), ability.effects.addKeyword('Renown')]
        });
    }

    areNoDragonsInPlay() {
        return !this.game.getPlayers().some((player) => {
            return player.anyCardsInPlay(
                (card) => card.getType() === 'character' && card.hasTrait('Dragon')
            );
        });
    }
}

DragonSkull.code = '13074';

export default DragonSkull;
