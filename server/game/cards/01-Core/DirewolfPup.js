import DrawCard from '../../drawcard.js';

class DirewolfPup extends DrawCard {
    // Direwolf Pup (01149)
    // No attachments.
    // Direwolf Pup gets +1 STR for each other Direwolf card you control.
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
