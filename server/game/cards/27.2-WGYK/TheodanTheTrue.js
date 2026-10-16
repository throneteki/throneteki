import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheodanTheTrue extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.isParticipating() && event.challenge.isMatch({ winner: this.controller })
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    trait: 'The Seven'
                }
            },
            message: '{player} uses {source} to give {target} insight or renown',
            limit: ability.limit.perPhase(2),
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.choose({
                        title: (context) => `Choose keyword for ${context.target.name}`,
                        message: {
                            format: '{player} chooses to have {target} gain {keyword} until the end of the phase',
                            args: {
                                keyword: (context) => context.selectedChoice.text.toLowerCase()
                            }
                        },
                        choices: {
                            Renown: GameActions.genericHandler((context) =>
                                this.gainKeyword(
                                    context.target,
                                    context.selectedChoice.text.toLowerCase()
                                )
                            ),
                            Insight: GameActions.genericHandler((context) =>
                                this.gainKeyword(
                                    context.target,
                                    context.selectedChoice.text.toLowerCase()
                                )
                            )
                        }
                    }),
                    context
                );
            }
        });
    }

    gainKeyword(card, keyword) {
        this.untilEndOfPhase((ability) => ({
            match: card,
            effect: ability.effects.addKeyword(keyword)
        }));
        return true;
    }
}

TheodanTheTrue.code = '27037';

export default TheodanTheTrue;
