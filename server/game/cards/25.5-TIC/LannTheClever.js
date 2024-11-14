import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class LannTheClever extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({
            type: 'location',
            faction: 'lannister',
            controller: 'current',
            unique: true
        });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === this.controller
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.returnToHand((card) =>
                    card.isMatch({ type: 'character', faction: 'lannister', participating: true })
                )
            ],
            message:
                '{player} kneels {costs.kneel} and returns {costs.returnToHand} to their hand to either gain 3 gold or 1 power for their faction',
            choices: {
                'Gain 3 gold': {
                    message: '{player} chooses to gain 3 gold',
                    gameAction: GameActions.gainGold((context) => ({
                        player: context.player,
                        amount: 3
                    }))
                },
                'Gain 1 power': {
                    message: '{player} chooses to gain 1 power for their faction',
                    gameAction: GameActions.gainPower((context) => ({
                        card: context.player.faction,
                        amount: 1
                    }))
                }
            }
        });
    }
}

LannTheClever.code = '25086';

export default LannTheClever;
