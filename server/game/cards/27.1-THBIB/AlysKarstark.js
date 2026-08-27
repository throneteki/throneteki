import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AlysKarstark extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardStood: (event) => event.card === this
            },
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    controller: 'current',
                    trait: 'Wildling',
                    condition: (card) => card !== this && GameActions.gainPower({ card }).allow()
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
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously([
                        GameActions.gainPower((context) => ({ card: context.target })),
                        GameActions.ifCondition({
                            condition: (context) => context.target.name === 'Sigorn',
                            thenAction: GameActions.drawCards((context) => ({
                                player: context.player,
                                amount: 1
                            }))
                        })
                    ]),
                    context
                );
            }
        });
    }
}

AlysKarstark.code = '27009';

export default AlysKarstark;
