import DrawCard from '../../drawcard.js';

const Icons = ['Military', 'Intrigue', 'Power'];

class Patchface extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: [
                ability.effects.dynamicKeywordSources(
                    (card) => card.isMatch({ type: 'character', trait: 'Fool' }) && card !== this
                ),
                ability.effects.dynamicIcons(() => this.getFoolIcons())
            ]
        });
    }

    getFoolIcons() {
        let foolIcons = [];
        let fools = this.game.filterCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait('Fool') && card !== this
        );

        for (let card of fools) {
            for (let icon of Icons) {
                if (card.hasIcon(icon)) {
                    foolIcons.push(icon);
                }
            }
        }

        return foolIcons;
    }
}

Patchface.code = '06107';

export default Patchface;
