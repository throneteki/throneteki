import DrawCard from '../../drawcard.js';

class TenTowersGalley extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.kneeled,
            match: (card) => card === card.controller.activePlot,
            targetController: 'opponent',
            effect: ability.effects.modifyReserve(-1)
        });

        this.action({
            title: 'Kneel Ten Towers Galley',
            condition: () => !this.kneeled,
            anyPlayer: true,
            cost: ability.costs.kneel(
                (card) => card.getType() === 'location' && card.getPrintedCost() >= 2
            ),
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to kneel {2}',
                    context.player,
                    context.costs.kneel,
                    this
                );
                this.controller.kneelCard(this);
            }
        });
    }
}

TenTowersGalley.code = '15028';

export default TenTowersGalley;
