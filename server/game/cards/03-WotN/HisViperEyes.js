import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HisViperEyes extends DrawCard {
    // His Viper Eyes (03032)
    // Reaction: After you lose a [military] or [power] challenge as the defending player, look at
    // the winning opponent's hand. Then, choose and discard 1 card from that hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.defendingPlayer === context.player &&
                    event.challenge.loser === context.player &&
                    ['military', 'power'].includes(event.challenge.challengeType)
            },
            message: {
                format: "{player} plays {source} to look at {winner}'s hand and discard 1 card from it",
                args: { winner: (context) => context.event.challenge.winner }
            },
            gameAction: GameActions.chooseCards({
                title: 'Select a card to discard',
                revealTargets: true,
                cardCondition: (card, context) =>
                    card.location === 'hand' && card.controller === context.event.challenge.winner,
                gameAction: (card) => GameActions.discardCard({ card })
            })
        });
    }
}

HisViperEyes.code = '03032';

export default HisViperEyes;
