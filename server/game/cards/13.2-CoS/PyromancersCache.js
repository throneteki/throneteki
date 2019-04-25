const DrawCard = require('../../drawcard');

class PyromancersCache extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location' });

        this.whileAttached({
            effect: ability.effects.blankExcludingTraits
        });

        // TODO: Have attached card gain the kneel to draw action
    }
}

PyromancersCache.code = '13030';

module.exports = PyromancersCache;

