import DrawCard from '../../drawcard.js';

class TheSeastoneChair extends DrawCard {
    // The Seastone Chair (02011)
    // Interrupt: When claim is applied for an unopposed [military] challenge in which you are the
    // attacking player, kneel your faction card to choose a character without attachments,
    // controlled by the losing opponent. Instead of the normal claim effects, kill that character.
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
