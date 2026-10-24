import DrawCard from '../../drawcard.js';

class WaterGardensSentry extends DrawCard {
    // Water Gardens Sentry (25067)
    // While you control a [martell] Lord or Lady character, Water Gardens Sentry may be declared as
    // a defender during [intrigue] challenges in which you are the defending player.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.controller.anyCardsInPlay({
                    type: 'character',
                    faction: 'martell',
                    trait: ['Lord', 'Lady']
                }) &&
                context.game.isDuringChallenge({
                    challengeType: 'intrigue',
                    defendingPlayer: context.source.controller
                }),
            match: this,
            effect: [ability.effects.canBeDeclaredWithoutIcon()]
        });
    }
}

WaterGardensSentry.code = '25067';

export default WaterGardensSentry;
