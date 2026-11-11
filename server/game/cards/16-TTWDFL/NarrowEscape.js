import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import GenericTracker from '../../EventTrackers/GenericTracker.js';

class NarrowEscape extends DrawCard {
    // Narrow Escape (16024)
    // Action: Put each character that was killed or discarded from play this phase into play from
    // its owner's dead or discard pile. An opponent may discard his or her hand (of at least 1
    // card) to cancel this effect. (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.killTracker = GenericTracker.forPhase(this.game, 'onCharacterKilled');
        this.discardTracker = GenericTracker.forPhase(this.game, 'onCardDiscarded');
        this.action({
            title: 'Put characters into play',
            message: {
                format: '{player} plays {source} to put {characters} into play',
                args: { characters: (context) => eligibleCharacters(context.source) }
            },
            gameAction: askToCancel(0),
            max: ability.limit.perPhase(1)
        });
    }
}

const MaxOpponents = 5;

function eligibleCharacters(source) {
    const eligibleKilled = source.killTracker.events
        .map((event) => event.card)
        .filter((card) => card.location === 'dead pile');
    const eligibleDiscards = source.discardTracker.events
        .filter(
            (event) =>
                event.originalLocation === 'play area' && event.card.location === 'discard pile'
        )
        .map((event) => event.card);
    return eligibleKilled
        .concat(eligibleDiscards)
        .filter((card) => card.owner.canPutIntoPlay(card));
}

function cancellingOpponents(context) {
    return context.ability?.cannotBeCanceled
        ? []
        : context.game
              .getOpponentsInFirstPlayerOrder(context.player)
              .filter((opponent) => opponent.hand.length >= 1);
}

function askToCancel(index) {
    if (index >= MaxOpponents) {
        return putIntoPlay();
    }

    return GameActions.ifCondition({
        condition: (context) => cancellingOpponents(context).length > index,
        thenAction: GameActions.choose({
            player: (context) => cancellingOpponents(context)[index],
            title: 'Discard hand to cancel?',
            choices: {
                Yes: {
                    message:
                        '{choosingPlayer} discards their hand to cancel the effects of {source}',
                    gameAction: GameActions.simultaneously((context) =>
                        cancellingOpponents(context)[index].hand.map((card) =>
                            GameActions.discardCard({ card })
                        )
                    )
                },
                No: askToCancel(index + 1)
            }
        }),
        elseAction: putIntoPlay()
    });
}

function putIntoPlay() {
    return GameActions.simultaneously((context) =>
        eligibleCharacters(context.source).map((card) =>
            GameActions.putIntoPlay({ card, player: card.owner })
        )
    );
}

NarrowEscape.code = '16024';

export default NarrowEscape;
