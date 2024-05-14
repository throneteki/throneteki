const DrawCard = require('../../drawcard.js');

class TunnelsOfTheRedKeep extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel and return to shadows',
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to return {source} to shadows',
            handler: (context) => {
                context.player.putIntoShadows(this, false, () => {
                    let strBoost = context.player.shadows.length;
                    let targetCharacters = context.player.filterCardsInPlay(
                        (card) => card.getType() === 'character'
                    );
                    this.game.addMessage(
                        'Then {0} gains +{1} STR for {2}',
                        targetCharacters,
                        strBoost,
                        this
                    );
                    this.untilEndOfPhase((ability) => ({
                        match: targetCharacters,
                        effect: ability.effects.modifyStrength(strBoost)
                    }));
                });
            },
            max: ability.limit.perPhase(1)
        });
    }
}

TunnelsOfTheRedKeep.code = '13070';

module.exports = TunnelsOfTheRedKeep;
