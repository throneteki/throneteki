import CardEntersPlayTracker from '../../EventTrackers/CardEntersPlayTracker.js';
import PlotCard from '../../plotcard.js';

class StrainedReserves extends PlotCard {
    setupCardAbilities(ability) {
        this.enterPlayTracker = CardEntersPlayTracker.forRound(this.game);

        this.persistentEffect({
            targetController: 'any',
            effect: [
                ability.effects.cannotMarshal(
                    (card) => this.isTargetCardType(card) && this.hasReachedLimit(card.controller)
                ),
                ability.effects.cannotPutIntoPlay(
                    (card) => this.isTargetCardType(card) && this.hasReachedLimit(card.controller)
                )
            ]
        });
    }

    isTargetCardType(card) {
        return ['character', 'location', 'attachment'].includes(card.getType());
    }

    hasReachedLimit(player) {
        return (
            this.enterPlayTracker.events.filter(
                (event) =>
                    event.card.controller === player &&
                    this.isTargetCardType(event.card) &&
                    ['marshal', 'ambush', 'outOfShadows', 'play'].includes(event.playingType)
            ).length >= this.getLimit(player)
        );
    }

    getLimit(player) {
        return player.activePlot && player.activePlot.hasTrait('Summer') ? 4 : 2;
    }
}

StrainedReserves.code = '26060';

export default StrainedReserves;
