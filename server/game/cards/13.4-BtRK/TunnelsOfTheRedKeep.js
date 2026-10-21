import DrawCard from '../../drawcard.js';

class TunnelsOfTheRedKeep extends DrawCard {
    // Tunnels of the Red Keep (13070)
    // Shadow (2).
    // Action: Kneel Tunnels of the Red Keep to return it to shadows. Then, until the end of the
    // phase, each character you control gets +1 STR for each card you control in shadows. (Max 1
    // per phase.)
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

export default TunnelsOfTheRedKeep;
