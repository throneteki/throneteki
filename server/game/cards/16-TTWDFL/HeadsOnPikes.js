const DrawCard = require('../../drawcard');

class HeadsOnPikes extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard cards',
            handler: () => {
            }
        });
    }
}

HeadsOnPikes.code = '16023';

module.exports = HeadsOnPikes;
