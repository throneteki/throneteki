const DrawCard = require('../../drawcard.js');

class WaterGardensSentry extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay({ type: 'character', faction: 'martell', trait: ['Lord', 'Lady'] }) && this.game.isDuringChallenge({ challengeType: ['intrigue', 'power'], defendingPlayer: this.controller }),
            match: this,
            effect: [
                ability.effects.canBeDeclaredWithoutIcon()
            ]
        });
    }
}

WaterGardensSentry.code = '25542';
WaterGardensSentry.version = '1.0';

module.exports = WaterGardensSentry;
