import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AbelsWasherwoman extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character keyword',
            limit: ability.limit.perRound(1),
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area'
                }
            },
            cost: ability.costs.kneel((card) => !card.isLimited() && card.getType() === 'location'),
            handler: (context) => {
                context.game.resolveGameAction(
                    GameActions.choose({
                        title: (context) => `Choose keyword for ${context.target.name} to gain`,
                        message: {
                            format: '{player} uses {source} and kneels {kneltCard} to have {target} gain {keyword} until the end of the phase',
                            args: {
                                kneltCard: (context) => context.costs.kneel,
                                keyword: (context) => context.selectedChoice.text.toLowerCase()
                            }
                        },
                        choices: {
                            Pillage: GameActions.genericHandler((context) =>
                                this.gainKeyword(context, 'pillage')
                            ),
                            Stealth: GameActions.genericHandler((context) =>
                                this.gainKeyword(context, 'stealth')
                            )
                        }
                    }),
                    context
                );
            }
        });
    }

    gainKeyword(context, keyword) {
        this.untilEndOfPhase((ability) => ({
            match: context.target,
            effect: ability.effects.addKeyword(keyword)
        }));
        return true;
    }
}

AbelsWasherwoman.code = '00214';

export default AbelsWasherwoman;
