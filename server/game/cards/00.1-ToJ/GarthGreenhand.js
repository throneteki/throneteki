import DrawCard from '../../drawcard.js';

class GarthGreenhand extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({
            type: 'location',
            controller: 'current',
            limited: false
        });
        this.plotModifiers({
            gold: 1
        });
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge(),
            match: (card) =>
                card.controller === this.controller && card.isUnique() && card.isParticipating(),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

GarthGreenhand.code = '00275';

export default GarthGreenhand;
