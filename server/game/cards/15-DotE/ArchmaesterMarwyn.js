import DrawCard from '../../drawcard.js';
import GenericTracker from '../../EventTrackers/GenericTracker.js';
import GameActions from '../../GameActions/index.js';

class ArchmaesterMarwyn extends DrawCard {
    // Archmaester Marwyn (15041)
    // Once per phase, you may marshal or play a facedown card under your agenda as if it were in
    // your hand.
    // Reaction: After Archmaester Marwyn enters play, place the top 2 cards of your deck facedown
    // under your agenda.
    setupCardAbilities(ability) {
        this.enterPlayTracker = GenericTracker.forPhase(this.game, 'onCardMarshalled');
        this.playedTracker = GenericTracker.forPhase(this.game, 'onCardPlayed');

        this.persistentEffect({
            condition: () =>
                !this.hasPlayedFromUnderAgenda() && !this.hasMarshalledFromUnderAgenda(),
            targetController: 'current',
            effect: [
                ability.effects.canMarshal((card) => this.isUnderneathAgenda(card)),
                ability.effects.canMarshalIntoShadows((card) => this.isUnderneathAgenda(card)),
                ability.effects.canPlay((card) => this.isUnderneathAgenda(card))
            ]
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            message:
                '{player} uses {source} to place top 2 cards of their deck facedown under their agenda',
            gameAction: GameActions.simultaneously((context) =>
                context.player.drawDeck.slice(0, 2).map((card) =>
                    GameActions.placeCardUnderneath({
                        card,
                        parentCard: context.player.agenda,
                        facedown: true
                    })
                )
            )
        });
    }

    hasPlayedFromUnderAgenda() {
        return this.playedTracker.events.some(
            (event) =>
                event.originalParent === this.controller.agenda &&
                event.originalLocation === 'underneath' &&
                event.player === this.controller
        );
    }

    hasMarshalledFromUnderAgenda() {
        return this.enterPlayTracker.events.some(
            (event) =>
                event.originalParent === this.controller.agenda &&
                event.originalLocation === 'underneath' &&
                event.originalController === this.controller
        );
    }

    isUnderneathAgenda(card) {
        return this.controller.agenda.underneath.includes(card);
    }
}

ArchmaesterMarwyn.code = '15041';

export default ArchmaesterMarwyn;
