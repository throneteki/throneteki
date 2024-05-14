const DrawCard = require('../../drawcard');
const GenericTracker = require('../../EventTrackers/GenericTracker');

class ArchmaesterMarwyn extends DrawCard {
    setupCardAbilities(ability) {
        this.enterPlayTracker = GenericTracker.forPhase(this.game, 'onCardMarshalled');
        this.playedTracker = GenericTracker.forPhase(this.game, 'onCardPlayed');

        this.persistentEffect({
            condition: () =>
                !this.hasPlayedFromUnderAgenda() && !this.hasMarshalledFromUnderAgenda(),
            targetController: 'current',
            effect: [
                ability.effects.canMarshal((card) => card.location === 'conclave'),
                ability.effects.canMarshalIntoShadows((card) => card.location === 'conclave'),
                ability.effects.canPlay((card) => card.location === 'conclave')
            ]
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && this.controller.agenda
            },
            message: '{player} uses {source} to put top 2 cards of their deck under their agenda',
            handler: (context) => {
                const topCards = context.player.drawDeck.slice(0, 2);
                for (const card of topCards) {
                    context.player.moveCard(card, 'conclave');
                }
            }
        });
    }

    hasPlayedFromUnderAgenda() {
        return this.playedTracker.events.some(
            (event) => event.originalLocation === 'conclave' && event.player === this.controller
        );
    }

    hasMarshalledFromUnderAgenda() {
        return this.enterPlayTracker.events.some(
            (event) =>
                event.originalLocation === 'conclave' &&
                event.originalController === this.controller
        );
    }
}

ArchmaesterMarwyn.code = '15041';

module.exports = ArchmaesterMarwyn;
