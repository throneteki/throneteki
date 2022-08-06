const AgendaCard = require('../../agendacard');
const AbilityLimit = require('../../abilitylimit.js');
const EventPlayedTracker = require('../../EventTrackers/EventPlayedTracker');
const CardEntersPlayTracker = require('../../EventTrackers/CardEntersPlayTracker');

class BannerOfTheFalcon extends AgendaCard {
    setupCardAbilities(ability) {
        this.eventPlayedTracker = EventPlayedTracker.forRound(this.game);
        this.enteredPlayTracker = CardEntersPlayTracker.forRound(this.game);
        const inFactionMatcher = card => card.isFaction(card.owner.faction.getPrintedFaction());

        this.persistentEffect({
            targetController: 'any',
            match: player => !this.eventPlayedTracker.hasPlayedEvent(player, inFactionMatcher)
                                && !this.enteredPlayTracker.hasPlayerAmbushedAnyCardWithPredicate(player, inFactionMatcher)
                                && !this.enteredPlayTracker.hasPlayerBroughtOutOfShadowsAnyCardWithPredicate(player, inFactionMatcher),
            effect: ability.effects.increaseCost({
                playingTypes: ['play', 'ambush', 'outOfShadows'],
                limit: AbilityLimit.perRound(1),
                match: inFactionMatcher,
                amount: 1
            })
        });

        this.persistentEffect({
            condition: () => this.game.getOpponents(this.controller).every(player => player.getTotalInitiative() > this.controller.getTotalInitiative()),
            match: card => card.hasTrait('House Arryn') && card.getType() === 'character' && card.controller === this.controller,
            effect: ability.effects.modifyStrength(1)
        });
    }
}

BannerOfTheFalcon.code = '23040';

module.exports = BannerOfTheFalcon;
