const DrawCard = require('../../drawcard');
const EventPlayedTracker = require('../../EventTrackers/EventPlayedTracker');

class WhiteSwordTower extends DrawCard {
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

module.exports = WhiteSwordTower;
