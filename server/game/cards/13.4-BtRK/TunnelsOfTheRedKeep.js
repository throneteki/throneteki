import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
            gameAction: GameActions.putIntoShadows((context) => ({
                card: context.source,
                allowSave: false
            })).then((context) => {
                const strength = context.player.shadows.length;
                const characters = context.player.filterCardsInPlay(
                    (card) => card.getType() === 'character'
                );
                return {
                    message: {
                        format: '{player} gives {characters} +{strength} STR until the end of the phase',
                        args: { characters: () => characters, strength: () => strength }
                    },
                    gameAction: GameActions.lastingEffect(() => ({
                        duration: 'untilEndOfPhase',
                        match: characters,
                        effect: ability.effects.modifyStrength(strength)
                    }))
                };
            }),
            max: ability.limit.perPhase(1)
        });
    }
}

TunnelsOfTheRedKeep.code = '13070';

export default TunnelsOfTheRedKeep;
