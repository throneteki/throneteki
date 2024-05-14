const DrawCard = require('../../drawcard.js');

class SupportFromTheIronBank extends DrawCard {
    setupCardAbilities() {
        this.action({
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    effect: ability.effects.reduceCost({
                        playingTypes: ['marshal', 'play'],
                        amount: 1,
                        match: (card) =>
                            card.isFaction('baratheon') && card.getType() !== 'character'
                    })
                }));

                this.game.addMessage(
                    '{0} uses {1} to reduce the cost of each {2} non-character card they marshal or play this phase by 1',
                    context.player,
                    this,
                    'baratheon'
                );
            }
        });
    }
}

SupportFromTheIronBank.code = '19002';

module.exports = SupportFromTheIronBank;
