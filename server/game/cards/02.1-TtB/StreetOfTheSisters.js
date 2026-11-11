import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StreetOfTheSisters extends DrawCard {
    // Street of the Sisters (02018)
    // Reaction: After you win a [power] challenge by 5 or more STR, kneel your faction card to gain
    // 1 power for your faction.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'power' &&
                    event.challenge.strengthDifference >= 5 &&
                    context.source.controller.canGainFactionPower()
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} and kneels their faction card to gain 1 power for their faction',
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 1
            }))
        });
    }
}

StreetOfTheSisters.code = '02018';

export default StreetOfTheSisters;
