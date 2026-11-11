import PlotCard from '../../plotcard.js';

class WardensOfTheEast extends PlotCard {
    // Wardens of the East (23039)
    // Each player cannot play in-faction events, and plays with each card in their shadows area
    // revealed.
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
