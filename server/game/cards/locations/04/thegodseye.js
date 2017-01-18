const DrawCard = require('../../../drawcard.js');

class TheGodsEye extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });
    }

    getIncome() {
        if(!this.isBlank()) {
            return 1;
        }
    }
}

TheGodsEye.code = '04058';

module.exports = TheGodsEye;
