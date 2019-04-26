const DrawCard = require('../../drawcard');

class PyromancersCache extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location' });

        this.whileAttached({
            effect: ability.effects.blankExcludingTraits
        });
    }
}

PyromancersCache.code = '13030';

PyromancersCache.TODO = 'The attached card does not gain the kneel to draw action';

module.exports = PyromancersCache;

