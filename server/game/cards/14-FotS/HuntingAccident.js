import DrawCard from '../../drawcard.js';

class HuntingAccident extends DrawCard {
    // Hunting Accident (14021)
    // Ambush (3). Terminal.
    // Attached character cannot stand.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cannotBeStood()
        });
    }
}

HuntingAccident.code = '14021';

export default HuntingAccident;
