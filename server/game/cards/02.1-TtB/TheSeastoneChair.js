import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheSeastoneChair extends DrawCard {
    // The Seastone Chair (02011)
    // Interrupt: When claim is applied for an unopposed [military] challenge in which you are the
    // attacking player, kneel your faction card to choose a character without attachments,
    // controlled by the losing opponent. Instead of the normal claim effects, kill that character.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: (event, context) =>
                    event.challenge &&
                    event.challenge.isUnopposed() &&
                    event.challenge.challengeType === 'military' &&
                    event.challenge.attackingPlayer === context.player
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.event.challenge.loser &&
                    card.attachments.length === 0
            },
            message:
                '{player} uses {source} and kneels their faction card to kill {target} instead of normal claim effects',
            gameAction: GameActions.replaceEvent((context) => ({
                event: context.event,
                replacement: GameActions.kill({ card: context.target })
            }))
        });
    }
}

TheSeastoneChair.code = '02011';

export default TheSeastoneChair;
