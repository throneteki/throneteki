import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OursIsTheOldWay extends DrawCard {
    // Ours is the Old Way (04032)
    // Challenges Action: Until the end of the phase, either: each [greyjoy] character you control
    // gains stealth, or each non-[greyjoy] character loses stealth.
    setupCardAbilities(ability) {
        this.action({
            title: 'Characters gain or lose stealth',
            phase: 'challenge',
            gameAction: GameActions.choose({
                title: 'Characters gain or lose stealth?',
                choices: {
                    'Gain stealth': {
                        message:
                            '{player} plays {source} to have each greyjoy character they control gain stealth until the end of the phase',
                        gameAction: GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.player.filterCardsInPlay(
                                (card) =>
                                    card.isFaction('greyjoy') && card.getType() === 'character'
                            ),
                            effect: ability.effects.addKeyword('stealth')
                        }))
                    },
                    'Lose stealth': {
                        message:
                            '{player} plays {source} to have each non-greyjoy character lose stealth until the end of the phase',
                        gameAction: GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.game.filterCardsInPlay(
                                (card) =>
                                    !card.isFaction('greyjoy') && card.getType() === 'character'
                            ),
                            targetController: 'any',
                            effect: ability.effects.removeKeyword('stealth')
                        }))
                    }
                }
            })
        });
    }
}

OursIsTheOldWay.code = '04032';

export default OursIsTheOldWay;
