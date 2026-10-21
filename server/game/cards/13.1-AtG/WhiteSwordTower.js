import DrawCard from '../../drawcard.js';
import EventPlayedTracker from '../../EventTrackers/EventPlayedTracker.js';

class WhiteSwordTower extends DrawCard {
    // White Sword Tower (13018)
    // Each Kingsguard character you control gets +1 STR.
    // Each player that does not control a Kingsguard character cannot play more than 1 event each
    // phase.
    setupCardAbilities(ability) {
        this.tracker = EventPlayedTracker.forPhase(this.game);

        this.persistentEffect({
            match: (card) =>
                card.getType() === 'character' &&
                card.controller === this.controller &&
                card.hasTrait('Kingsguard'),
            effect: ability.effects.modifyStrength(1)
        });

        this.persistentEffect({
            condition: () => true,
            match: (player) =>
                !this.controlsKingsguard(player) &&
                this.tracker.getNumberOfPlayedEvents(player) >= 1,
            targetController: 'any',
            effect: ability.effects.cannotPlay((card) => card.getType() === 'event')
        });
    }

    controlsKingsguard(player) {
        return player.anyCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait('Kingsguard')
        );
    }
}

WhiteSwordTower.code = '13018';

export default WhiteSwordTower;
