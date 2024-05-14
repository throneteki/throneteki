import PlotCard from '../../plotcard.js';

class WardensOfTheEast extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: [
                ability.effects.cannotPlay(
                    (card) =>
                        card.getPrintedType() === 'event' &&
                        card.isFaction(card.controller.faction.getPrintedFaction())
                ),
                ability.effects.revealShadows()
            ]
        });
    }
}

WardensOfTheEast.code = '23039';

export default WardensOfTheEast;
