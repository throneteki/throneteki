const DrawCard = require('../../drawcard');

class Summerhall extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: () => (
                !this.kneeled &&
                this.game.isDuringChallenge({ challengeType: 'power' })
            ),
            effect: ability.effects.cannotPutIntoPlay((card, playingType) => playingType !== 'play')
        });

        this.persistentEffect({
            targetController: 'any',
            match: card => ['play area', 'duplicate'].includes(card.location),
            condition: () => (
                !this.kneeled &&
                this.game.isDuringChallenge({ challengeType: 'power' })
            ),
            effect: [
                ability.effects.cannotBeKilled(),
                ability.effects.cannotBeDiscarded(),
                ability.effects.cannotBePutIntoShadows(),
                ability.effects.cannotBeRemovedFromGame(),
                ability.effects.cannotBeReturnedToHand(),
                ability.effects.cannotBeSacrificed(),
                ability.effects.cannotBeReturnedToDeck()
            ]
        });
    }
}

Summerhall.code = '21003';

module.exports = Summerhall;
