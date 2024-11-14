import AgendaCard from '../../agendacard.js';
import ChallengeTypes from '../../ChallengeTypes.js';
import GameActions from '../../GameActions/index.js';

class TheFreeFolk extends AgendaCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onClaimApplied: (event) =>
                    event.challenge &&
                    event.challenge.attackers.some(
                        (attacker) =>
                            attacker.controller === this.controller &&
                            attacker.getType() === 'character' &&
                            attacker.hasTrait('Wildling')
                    )
            },
            cost: ability.costs.kneelFactionCard(),
            handler: (context) => {
                this.initialClaim = context.event.claim;
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Select a challenge type',
                        buttons: ChallengeTypes.asButtons({ method: 'applyClaim' }).filter(
                            (button) => button.arg !== context.event.challenge.challengeType
                        )
                    },
                    source: this
                });
            }
        });
    }

    applyClaim(player, claimType) {
        this.game.addMessage(
            '{0} uses {1} and kneels their faction card to apply {2} claim against {3}',
            this.controller,
            this,
            claimType,
            this.initialClaim.recipients
        );

        let claim = this.initialClaim.clone();
        claim.challengeType = claimType;
        this.game.resolveGameAction(GameActions.applyClaim({ player, claim, game: this.game }));

        return true;
    }
}

TheFreeFolk.code = '11079';

export default TheFreeFolk;
