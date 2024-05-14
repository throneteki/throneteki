import DrawCard from '../../drawcard.js';

class SerRobarRoyce extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -1
        });

        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ number: 1 }),
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
