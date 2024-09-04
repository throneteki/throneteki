import DrawCard from '../../drawcard.js';

class TheSeastoneChair extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge &&
                    event.challenge.isUnopposed() &&
                    event.challenge.challengeType === 'military' &&
                    event.challenge.attackingPlayer === this.controller
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.game.currentChallenge.loser &&
                    card.attachments.length === 0,
                gameAction: 'kill'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} and kneels their faction card to kill {2} instead of normal claim effects',
                    this.controller,
                    this,
                    context.target
                );
                context.replaceHandler(() => {
                    context.target.controller.killCharacter(context.target);
                });
            }
        });
    }
}

TheSeastoneChair.code = '02011';

export default TheSeastoneChair;
