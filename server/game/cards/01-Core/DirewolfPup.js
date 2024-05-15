import DrawCard from '../../drawcard.js';

class DirewolfPup extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card === this,
            effect: ability.effects.dynamicStrength(() => this.getNumberOfOtherDirewolves())
        });
    }

    getNumberOfOtherDirewolves() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card !== this && card.hasTrait('Direwolf')
        );
    }
}

DirewolfPup.code = '01149';

export default DirewolfPup;
