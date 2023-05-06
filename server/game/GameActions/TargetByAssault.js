const GameAction = require('./GameAction');
const KneelCard = require('./KneelCard');

class TargetByAssault extends GameAction {
    constructor() {
        super('targetByAssault');
    }

    canChangeGameState({ challenge, source, target }) {
        return target.controller === challenge.defendingPlayer &&
            target.location === 'play area' &&
            target.getType() === 'location' &&
            (source.challengeOptions.contains('ignoresAssaultLocationCost') || target.getPrintedCost() < source.getPrintedCost());
    }

    createEvent({ challenge, source, target }) {
        return this.event('onTargetedByAssault', { challenge, source, target }, () => {
            target.targetedByAssault = true;

            source.untilEndOfChallenge(ability => ({
                match: target,
                effect: ability.effects.blankExcludingTraits
            }));

            challenge.game.once('afterChallenge', event => {
                const props = { card: target, source: source, reason: 'assault' };
                if(challenge.winner === source.controller 
                    && challenge.winner.anyCardsInPlay(card => card.isAttacking() && card.hasKeyword('assault'))
                    && KneelCard.allow(props)) {
                    event.thenAttachEvent(KneelCard.createEvent(props)
                        .thenExecute(() => challenge.game.addMessage('{0} kneels {1} due to assault', challenge.winner, target)));
                }
            });
        });
    }
}

module.exports = new TargetByAssault();
