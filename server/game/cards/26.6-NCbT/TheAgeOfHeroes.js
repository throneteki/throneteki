import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class TheAgeOfHeroes extends PlotCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} and kneels their faction card to search their deck of a Legacy or Valyrian Steel attachment',
            gameAction: GameActions.search({
                title: 'Select an attachment',
                match: { type: 'attachment', trait: ['Legacy', 'Valyrian Steel'] },
                gameAction: GameActions.ifCondition({
                    condition: (context) =>
                        !context.searchTarget.hasTrait('Tapestry') ||
                        !context.player.canPutIntoPlay(context.searchTarget),
                    thenAction: {
                        message: '{player} {gameAction}',
                        gameAction: GameActions.addToHand((context) => ({
                            card: context.searchTarget
                        }))
                    },
                    elseAction: GameActions.choose({
                        title: 'Put card into play?',
                        message: '{player} {gameAction}',
                        choices: {
                            'Add to hand': GameActions.addToHand((context) => ({
                                card: context.searchTarget
                            })),
                            'Put into play': GameActions.putIntoPlay((context) => ({
                                card: context.searchTarget
                            }))
                        }
                    })
                })
            })
        });
    }
}

TheAgeOfHeroes.code = '26615';
TheAgeOfHeroes.version = '1.0.3';

export default TheAgeOfHeroes;
