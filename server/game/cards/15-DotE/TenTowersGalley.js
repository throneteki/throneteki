import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TenTowersGalley extends DrawCard {
    // Ten Towers Galley (15028)
    // While Ten Towers Galley is standing, reduce the reserve value on each opponent's revealed
    // plot by 1.
    // Action: Kneel a location with printed cost 2 or higher to kneel Ten Towers Galley. Any player
    // may initiate this ability.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.source.kneeled,
            match: (card) => card === card.controller.activePlot,
            targetController: 'opponent',
            effect: ability.effects.modifyReserve(-1)
        });

        this.action({
            title: 'Kneel Ten Towers Galley',
            condition: (context) => !context.source.kneeled,
            anyPlayer: true,
            cost: ability.costs.kneel(
                (card) => card.getType() === 'location' && card.getPrintedCost() >= 2
            ),
            message: '{player} kneels {costs.kneel} to kneel {source}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.source }))
        });
    }
}

TenTowersGalley.code = '15028';

export default TenTowersGalley;
