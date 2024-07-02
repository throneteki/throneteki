import DrawCard from '../../drawcard.js';

class WaterGardensSentry extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.controller.anyCardsInPlay({
                    type: 'character',
                    faction: 'martell',
                    trait: ['Lord', 'Lady']
                }) &&
                this.game.isDuringChallenge({
                    challengeType: 'intrigue',
                    defendingPlayer: this.controller
                }),
            match: this,
            effect: [ability.effects.canBeDeclaredWithoutIcon()]
        });
    }
}

WaterGardensSentry.code = '25067';

export default WaterGardensSentry;
