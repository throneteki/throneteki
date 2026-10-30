import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class TheFreeFolk extends AgendaCard {
    // The Free Folk (11079)
    // Your plot deck and draw deck can only include neutral cards.
    // Reaction: After claim is applied for a challenge in which you control an attacking Wildling
    // character, kneel your faction card to apply the claim of another challenge type.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onClaimApplied: (event, context) =>
                    event.challenge &&
                    event.challenge.attackers.some(
                        (attacker) =>
                            attacker.controller === context.player &&
                            attacker.getType() === 'character' &&
                            attacker.hasTrait('Wildling')
                    )
            },
            cost: ability.costs.kneelFactionCard(),
            gameAction: GameActions.chooseChallengeType({
                exclude: (context) => context.event.challenge.challengeType,
                message: {
                    format: '{player} uses {source} and kneels their faction card to apply {challengeType} claim against {recipients}',
                    args: { recipients: (context) => context.event.claim.recipients }
                },
                gameAction: (challengeType) =>
                    GameActions.applyClaim((context) => {
                        const claim = context.event.claim.clone();
                        claim.challengeType = challengeType;
                        return { player: context.player, claim, game: context.game };
                    })
            })
        });
    }
}

TheFreeFolk.code = '11079';

export default TheFreeFolk;
