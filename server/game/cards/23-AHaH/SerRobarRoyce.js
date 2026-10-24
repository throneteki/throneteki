import DrawCard from '../../drawcard.js';

class SerRobarRoyce extends DrawCard {
    // Ser Robar Royce (23015)
    // Ser Robar Royce cannot be declared as an attacker or defender in the first challenge each
    // player initiates each round.
    // -1 Initiative.
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -1
        });

        this.persistentEffect({
            condition: (context) => context.game.isDuringChallenge({ number: 1 }),
            match: this,
            effect: [
                ability.effects.cannotBeDeclaredAsAttacker(),
                ability.effects.cannotBeDeclaredAsDefender()
            ]
        });
    }
}

SerRobarRoyce.code = '23015';

export default SerRobarRoyce;
