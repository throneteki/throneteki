import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AlysKarstark extends DrawCard {
    // Alys Karstark (27009)
    // Reaction: After Alys Karstark stands, choose another Wildling character you control and have
    // it gain 1 power. Then, if that character was Sigorn, draw 1 card. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardStood: (event, context) => event.card === context.source
            },
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    controller: 'current',
                    trait: 'Wildling',
                    condition: (card, context) =>
                        card !== context.source && GameActions.gainPower({ card }).allow()
                }
            },
            message: {
                format: '{player} uses {source} to have {target} gain 1 power{additional}',
                args: {
                    additional: (context) =>
                        context.target.name === 'Sigorn' ? ', and draws 1 card' : ''
                }
            },
            limit: ability.limit.perRound(2),
            gameAction: GameActions.simultaneously([
                GameActions.gainPower((context) => ({ card: context.target })),
                GameActions.ifCondition({
                    condition: (context) => context.target.name === 'Sigorn',
                    thenAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 1
                    }))
                })
            ])
        });
    }
}

AlysKarstark.code = '27009';

export default AlysKarstark;
