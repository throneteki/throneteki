import DrawCard from '../../drawcard.js';

class ShierakQiya extends DrawCard {
    // Shierak Qiya (04015)
    // Reaction: After you win a [power] challenge by 5 or more STR, kneel your faction card to
    // choose and stand a participating character.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'power' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) => card.location === 'play area' && card.isParticipating(),
                gameAction: 'stand'
            },
            handler: (context) => {
                this.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

ShierakQiya.code = '04015';

export default ShierakQiya;
