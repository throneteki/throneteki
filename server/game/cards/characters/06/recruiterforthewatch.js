const DrawCard = require('../../../drawcard.js');

class RecruiterForTheWatch extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.optionalStandDuringStanding()
        });
        // TODO: Marshaling action to take control.
    }
}

RecruiterForTheWatch.code = '06045';

module.exports = RecruiterForTheWatch;
