import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GreatKraken extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Balon Greyjoy',
            effect: ability.effects.addKeyword('stealth')
        });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.controller === event.challenge.winner && event.challenge.isUnopposed()
            },
            limit: ability.limit.perRound(2),
            choices: {
                'Draw 1 card': {
                    message: '{player} uses {source} to draw 1 card',
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 1
                    }))
                },
                'Gain 1 power': {
                    message: '{player} uses {source} to gain 1 power for their faction',
                    gameAction: GameActions.gainPower((context) => ({
                        card: context.player.faction,
                        amount: 1
                    }))
                }
            }
        });
    }
}

GreatKraken.code = '01078';

export default GreatKraken;
