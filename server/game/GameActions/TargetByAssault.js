import { Flags } from '../Constants/index.js';
import GameAction from './GameAction.js';
import KneelCard from './KneelCard.js';

class TargetByAssault extends GameAction {
    constructor() {
        super('targetByAssault');
    }

    canChangeGameState({ challenge, source, card }) {
        return (
            card.controller === challenge.defendingPlayer &&
            card.location === 'play area' &&
            card.getType() === 'location' &&
            (source.hasFlag(Flags.challengeOptions.ignoresAssaultLocationCost) ||
                card.getPrintedCost() < source.getPrintedCost())
        );
    }

    createEvent({ challenge, source, card }) {
        return this.event('onTargetedByAssault', { challenge, source, target: card }, (event) => {
            event.target.targetedByAssault = true;

            event.source.untilEndOfChallenge((ability) => ({
                match: event.target,
                effect: ability.effects.blankExcludingTraits
            }));

            event.challenge.game.once('afterChallenge', (afterChallengeEvent) => {
                const props = { card: event.target, source: event.source, reason: 'assault' };
                if (
                    event.challenge.winner === event.source.controller &&
                    event.challenge.winner.anyCardsInPlay(
                        (card) => card.isAttacking() && card.hasKeyword('assault')
                    ) &&
                    KneelCard.allow(props)
                ) {
                    afterChallengeEvent.thenAttachEvent(
                        KneelCard.createEvent(props).thenExecute(() =>
                            event.challenge.game.addMessage(
                                '{0} kneels {1} due to assault',
                                event.challenge.winner,
                                event.target
                            )
                        )
                    );
                }
            });
        });
    }
}

export default new TargetByAssault();
