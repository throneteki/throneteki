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
        const enterPlayTracker = GenericTracker.forPhase(this.game, 'onCardMarshalled');
        const playedTracker = GenericTracker.forPhase(this.game, 'onCardPlayed');

        this.persistentEffect({
            condition: (context) =>
                !hasPlayedFromUnderAgenda(playedTracker, context.source.controller) &&
                !hasMarshalledFromUnderAgenda(enterPlayTracker, context.source.controller),
            targetController: 'current',
            effect: [
                ability.effects.canMarshal((card, context) =>
                    isUnderneathAgenda(card, context.source.controller)
                ),
                ability.effects.canMarshalIntoShadows((card, context) =>
                    isUnderneathAgenda(card, context.source.controller)
                ),
                ability.effects.canPlay((card, context) =>
                    isUnderneathAgenda(card, context.source.controller)
                )
            ]
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
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
}

function hasPlayedFromUnderAgenda(playedTracker, player) {
    return playedTracker.events.some(
        (event) =>
            event.originalParent === player.agenda &&
            event.originalLocation === 'underneath' &&
            event.player === player
    );
}

function hasMarshalledFromUnderAgenda(enterPlayTracker, player) {
    return enterPlayTracker.events.some(
        (event) =>
            event.originalParent === player.agenda &&
            event.originalLocation === 'underneath' &&
            event.originalController === player
    );
}

function isUnderneathAgenda(card, player) {
    return player.agenda.underneath.includes(card);
}

ArchmaesterMarwyn.code = '15041';

export default ArchmaesterMarwyn;
