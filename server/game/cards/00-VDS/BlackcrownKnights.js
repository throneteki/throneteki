import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BlackcrownKnights extends DrawCard {
    // Blackcrown Knights (00016)
    // No attachments.
    // Reaction: After you win a [power] challenge in which Blackcrown Knights is participating,
    // discard 1 card from your hand to have Blackcrown Knights gain 2 power.
    // Draft format only.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'power' &&
                    context.source.isParticipating() &&
                    context.source.allowGameAction('gainPower')
            },
            cost: ability.costs.discardFromHand(),
            message:
                '{player} uses {source} and discards {costs.discardFromHand} from their hand to gain 2 power on {source}',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 2 }))
        });
    }
}

BlackcrownKnights.code = '00016';

export default BlackcrownKnights;
