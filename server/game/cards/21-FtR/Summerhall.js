import DrawCard from '../../drawcard.js';

class Summerhall extends DrawCard {
    // Summerhall (21003)
    // While Summerhall is standing, cards cannot enter or leave play during [power] challenges.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: (context) =>
                !context.source.kneeled &&
                context.game.isDuringChallenge({ challengeType: 'power' }),
            effect: ability.effects.cannotPutIntoPlay((card) => card.getType() !== 'event')
        });

        this.persistentEffect({
            targetController: 'any',
            match: (card) => ['play area', 'duplicate'].includes(card.location),
            condition: (context) =>
                !context.source.kneeled &&
                context.game.isDuringChallenge({ challengeType: 'power' }),
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

        this.persistentEffect({
            targetController: 'any',
            condition: (context) =>
                !context.source.kneeled &&
                context.game.isDuringChallenge({ challengeType: 'power' }),
            effect: ability.effects.cannotRevealPlot()
        });
    }
}

Summerhall.code = '21003';

export default Summerhall;
