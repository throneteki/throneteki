const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class PyromancersCache extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location' });

        this.whileAttached({
            effect: ability.effects.blankExcludingTraits
        });

        // TODO: Currently blanking is checking on the card gaining the text, not
        // the card giving the text. So the ability does not actualy work.
        this.whileAttached({
            effect: ability.effects.gainText((text) => {
                text.action({
                    title: 'Draw 1 card',
                    cost: ability.costs.kneelSelf(),
                    message: '{player} kneels {source} to draw 1 card',
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 1
                    }))
                });
            })
        });
    }
}

PyromancersCache.code = '13030';

module.exports = PyromancersCache;
